#!/usr/bin/env bash
#
# cfo-maintenance.sh — nightly patching, integrity check and backup for
# cms.cfoainexus.com. Installed at /usr/local/sbin/cfo-maintenance.sh.
#
# Added 2026-08-30. Background: the site was compromised three times. The
# third breach was an automated scanner exploiting a plugin that was four
# patch releases out of date, with auto-updates switched off. WordPress
# cannot update itself here on purpose — the webroot is owned root:www-data
# so PHP has no write access, which is what stops web shells being dropped.
# Updates therefore have to be applied by root, from cron, which is also a
# path an attacker who only has WordPress admin cannot reach.
#
# Runs as root. Logs to /var/log/cfo-security.log alongside the mu-plugin's
# account alerts, so there is one file to watch.

set -uo pipefail

WP_PATH=/var/www/html
BACKUP_DIR=/var/backups/cfo
LOG=/var/log/cfo-security.log
KEEP_DAYS=14
WP="wp --path=${WP_PATH} --allow-root --quiet"

log()   { printf '%s [CFO-MAINT] %s\n' "$(date -u +%FT%T%:z)" "$*" >> "$LOG"; }
alert() { printf '%s [CFO-SECURITY] %s\n' "$(date -u +%FT%T%:z)" "$*" >> "$LOG"; ALERTS+=("$*"); }

ALERTS=()
mkdir -p "$BACKUP_DIR"

# ── 1. Patch ────────────────────────────────────────────────────────────────
# --minor keeps us inside the current major release, so security fixes land
# automatically but a major upgrade stays a deliberate decision.
core_before=$($WP core version 2>/dev/null)
$WP core update --minor      >/dev/null 2>&1
$WP plugin update --all      >/dev/null 2>&1
$WP theme  update --all      >/dev/null 2>&1
core_after=$($WP core version 2>/dev/null)
[ "$core_before" != "$core_after" ] && log "WordPress core updated: $core_before -> $core_after"

# Updates run as root and leave root-owned files behind. Restore the model
# that keeps PHP unable to write to code: root owns, www-data only reads.
chown -R root:www-data "$WP_PATH"
chown -R www-data:www-data "$WP_PATH/wp-content/uploads"
find "$WP_PATH" -type d ! -path "*/uploads*" -exec chmod 750 {} +
find "$WP_PATH" -type f ! -path "*/uploads*" -exec chmod 640 {} +

# ── 2. Integrity ────────────────────────────────────────────────────────────
# Only genuine content mismatches matter. "should not exist" / "doesn't exist"
# warnings are filtered: WordPress vendors libraries whose long paths the
# checksum manifest does not carry, and they produce constant false positives.
if $WP core verify-checksums 2>&1 | grep -q "doesn't verify against checksum"; then
    alert "CORE FILE MODIFIED — wp core verify-checksums reported altered content"
fi

# A PHP file under uploads is never legitimate. This is how web shells arrive.
shells=$(find "$WP_PATH/wp-content/uploads" \
         \( -name '*.php*' -o -name '*.pht*' -o -name '.htaccess' \) 2>/dev/null)
if [ -n "$shells" ]; then
    alert "EXECUTABLE FILE IN UPLOADS: $(echo "$shells" | tr '\n' ' ')"
fi

# Administrator accounts are the payload of every incident here so far: six
# rogue admins were created between 16 and 28 Aug 2026 and went unnoticed.
admins=$($WP user list --role=administrator --field=user_login 2>/dev/null | sort | tr '\n' ' ')
expected_file=/etc/cfo-expected-admins
if [ -f "$expected_file" ]; then
    expected=$(cat "$expected_file")
    if [ "$admins" != "$expected" ]; then
        alert "ADMINISTRATOR LIST CHANGED — expected [$expected] found [$admins]"
    fi
else
    echo "$admins" > "$expected_file"
    log "recorded baseline administrator list: $admins"
fi

# ── 3. Backup ───────────────────────────────────────────────────────────────
stamp=$(date -u +%Y%m%d-%H%M)
if $WP db export "$BACKUP_DIR/db-$stamp.sql" >/dev/null 2>&1; then
    gzip -f "$BACKUP_DIR/db-$stamp.sql"
    log "database backed up: db-$stamp.sql.gz ($(du -h "$BACKUP_DIR/db-$stamp.sql.gz" | cut -f1))"
else
    alert "BACKUP FAILED — wp db export returned an error"
fi
find "$BACKUP_DIR" -name 'db-*.sql.gz' -mtime +$KEEP_DAYS -delete

# ── 4. Notify ───────────────────────────────────────────────────────────────
# Only mails when something is actually wrong, so the message means something.
if [ ${#ALERTS[@]} -gt 0 ]; then
    # Recipients come from /etc/cfo-alert-recipients (one per line) so this can
    # be changed without touching WordPress; falls back to admin_email.
    if [ -s /etc/cfo-alert-recipients ]; then
        mapfile -t recipients < <(grep -vE '^\s*(#|$)' /etc/cfo-alert-recipients)
    else
        recipients=("$($WP option get admin_email 2>/dev/null)")
    fi
    body=$(printf '%s\n' "${ALERTS[@]}")
    esc=$(printf '%s' "$body" | sed "s/'/\\\\'/g")
    for to in "${recipients[@]}"; do
        [ -z "$to" ] && continue
        case "$to" in *.local|*.invalid) continue ;; esac
        if $WP eval "wp_mail('$to', '[CFO CMS] Security alert', '$esc');" >/dev/null 2>&1; then
            log "alert email sent to $to"
        else
            log "alert email FAILED for $to (mail transport not configured?)"
        fi
    done
    exit 1
fi

log "nightly maintenance completed clean"
exit 0
