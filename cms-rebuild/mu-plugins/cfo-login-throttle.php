<?php
/**
 * Plugin Name: CFO Login Throttle
 * Description: Rate-limits failed logins per IP and keeps the login form from
 *              confirming which usernames exist. Must-use plugin — loads before
 *              everything else and cannot be deactivated from wp-admin.
 * Version:     1.0
 *
 * Added 2026-09-12, when the temporary Caddy basic_auth gate in front of
 * wp-login.php was removed so each editor could sign in with their own
 * credentials. The gate was the only thing standing between the public
 * internet and an unlimited number of password guesses; this replaces it.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* Tunables. A legitimate person who has forgotten their password uses "Lost
 * your password?" long before five tries; a password-spraying bot needs
 * thousands. Both numbers sit comfortably between those two behaviours. */
define('CFO_LOGIN_MAX_ATTEMPTS', 5);     // failures allowed per window
define('CFO_LOGIN_WINDOW',       900);   // 15 min — how long failures accumulate
define('CFO_LOGIN_LOCKOUT',      1800);  // 30 min — how long a lock lasts

/**
 * The connecting address. This server sits directly on the internet with no
 * proxy in front of it, so REMOTE_ADDR is authoritative. X-Forwarded-For is
 * deliberately NOT trusted: it is attacker-controlled here, and honouring it
 * would let a bot dodge the limiter by sending a new header each request.
 */
function cfo_login_ip() {
    return $_SERVER['REMOTE_ADDR'] ?? 'cli';
}

function cfo_login_key($prefix) {
    return $prefix . md5(cfo_login_ip());
}

/* ─────────────────────────────────────────────────────────────────────────
 * 1. Refuse authentication outright while an IP is locked.
 *
 * Priority 30 runs after core's wp_authenticate_username_password (20), so a
 * locked-out IP is rejected regardless of whether the password was correct.
 * ───────────────────────────────────────────────────────────────────────── */

add_filter('authenticate', function ($user, $username) {
    if (get_transient(cfo_login_key('cfo_lock_'))) {
        return new WP_Error(
            'cfo_locked_out',
            sprintf(
                '<strong>Too many failed sign-in attempts.</strong> Try again in %d minutes, or use “Lost your password?” to set a new one.',
                (int) ceil(CFO_LOGIN_LOCKOUT / 60)
            )
        );
    }
    return $user;
}, 30, 2);

/* ─────────────────────────────────────────────────────────────────────────
 * 2. Count failures and lock the IP once the threshold is crossed.
 * ───────────────────────────────────────────────────────────────────────── */

add_action('wp_login_failed', function ($username) {
    $key   = cfo_login_key('cfo_fails_');
    $fails = (int) get_transient($key) + 1;

    // Keep the accumulating window fixed rather than sliding: set_transient
    // resets the expiry each call, which would otherwise let a slow-drip bot
    // stay one failure below the threshold indefinitely.
    set_transient($key, $fails, CFO_LOGIN_WINDOW);

    if ($fails >= CFO_LOGIN_MAX_ATTEMPTS) {
        set_transient(cfo_login_key('cfo_lock_'), 1, CFO_LOGIN_LOCKOUT);
        delete_transient($key);

        // One alert per lock, not one per attempt — a sustained attack must
        // not bury the account-creation tripwire under thousands of emails.
        if (function_exists('cfo_security_alert')) {
            cfo_security_alert(
                'Login lockout',
                sprintf(
                    'ip=%s locked for %d min after %d failed attempts | last tried username=%s',
                    cfo_login_ip(),
                    (int) ceil(CFO_LOGIN_LOCKOUT / 60),
                    $fails,
                    substr((string) $username, 0, 60)
                )
            );
        }
    }
});

/* Clear the counter on success, so an occasional typo never accumulates
 * towards a lockout across weeks. */
add_action('wp_login', function () {
    delete_transient(cfo_login_key('cfo_fails_'));
    delete_transient(cfo_login_key('cfo_lock_'));
});

/* ─────────────────────────────────────────────────────────────────────────
 * 3. Stop the login form from confirming valid usernames.
 *
 * Core answers "Unknown username" vs "The password you entered for the user
 * X is incorrect", which hands an attacker a free account-enumeration oracle
 * — the same thing cfo-hardening.php closes off on the sitemap and REST side.
 * The lockout notice is preserved: that one is ours and tells the person
 * something they need to know.
 * ───────────────────────────────────────────────────────────────────────── */

add_filter('login_errors', function ($error) {
    if (is_string($error) && str_contains($error, 'Too many failed sign-in attempts')) {
        return $error;
    }
    return '<strong>Sign-in failed.</strong> Check your email address and password, or use “Lost your password?” below.';
});
