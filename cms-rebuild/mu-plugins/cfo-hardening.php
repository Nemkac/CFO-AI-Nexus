<?php
/**
 * Plugin Name: CFO Hardening
 * Description: Removes username-enumeration surfaces and alerts on privileged
 *              account changes. Must-use plugin — loads before everything else
 *              and cannot be deactivated from wp-admin.
 * Version:     1.0
 *
 * Added 2026-08-30 after the third compromise of this site. The attacker
 * created six administrator accounts between 2026-08-16 and 2026-08-28 and
 * nobody noticed for two weeks. The alert at the bottom of this file is the
 * tripwire that would have caught it on day one.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* ─────────────────────────────────────────────────────────────────────────
 * 1. Username enumeration
 *
 * The attacker's first requirement is a valid username. WordPress hands it
 * out in three places by default. `wp-sitemap-users-1.xml` was publicly
 * serving "cfoainexuscms" right up until this file was written.
 * ───────────────────────────────────────────────────────────────────────── */

// Drop the users sitemap entirely (wp-sitemap-users-*.xml -> 404).
add_filter('wp_sitemaps_add_provider', function ($provider, $name) {
    return ('users' === $name) ? false : $provider;
}, 10, 2);

// Block ?author=N, which WordPress answers with a 301 to /author/<slug>/ and
// so hands out the username. Priority 0 is required: core registers
// redirect_canonical() on this same hook at priority 10 and, because
// default-filters.php loads before mu-plugins, it would otherwise win.
add_action('template_redirect', function () {
    if (!is_admin() && isset($_GET['author']) && !is_user_logged_in()) {
        wp_safe_redirect(home_url('/'), 301);
        exit;
    }
}, 0);

// Author archives themselves (/author/<slug>/) confirm a username is valid.
add_action('template_redirect', function () {
    if (is_author() && !is_user_logged_in()) {
        wp_safe_redirect(home_url('/'), 301);
        exit;
    }
}, 0);

// Require authentication for the REST users endpoints. WordPress exposes any
// user with a published post to anonymous callers; nothing on the public sites
// needs this, so it is closed outright.
add_filter('rest_authentication_errors', function ($result) {
    if (!empty($result)) {
        return $result;
    }
    $route = $GLOBALS['wp']->query_vars['rest_route'] ?? '';
    if (!$route && isset($_SERVER['REQUEST_URI'])) {
        $route = $_SERVER['REQUEST_URI'];
    }
    if (preg_match('#/wp/v2/users#', (string) $route) && !is_user_logged_in()) {
        return new WP_Error(
            'rest_forbidden',
            'Authentication required.',
            ['status' => 401]
        );
    }
    return $result;
});

// Belt and braces: strip users out of any REST index that still lists them.
add_filter('rest_endpoints', function ($endpoints) {
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    return $endpoints;
});

/* ─────────────────────────────────────────────────────────────────────────
 * 2. Version disclosure — tells a scanner exactly which exploits to try.
 * ───────────────────────────────────────────────────────────────────────── */

remove_action('wp_head', 'wp_generator');
add_filter('the_generator', '__return_empty_string');

/* ─────────────────────────────────────────────────────────────────────────
 * 3. Privileged-account tripwire
 *
 * Fires on any user creation, deletion, or promotion to administrator.
 * Writes to the PHP error log unconditionally (works with no mail server)
 * and emails admin_email as well once SMTP is configured.
 * ───────────────────────────────────────────────────────────────────────── */

define('CFO_SECURITY_LOG', '/var/log/cfo-security.log');

function cfo_security_alert($subject, $detail) {
    $ip   = $_SERVER['REMOTE_ADDR'] ?? 'cli';
    $ua   = $_SERVER['HTTP_USER_AGENT'] ?? 'none';
    $line = sprintf(
        '%s [CFO-SECURITY] %s | %s | ip=%s | ua=%s',
        gmdate('c'),
        $subject,
        $detail,
        $ip,
        substr($ua, 0, 120)
    );

    // A dedicated file, so alerts land in one predictable place regardless of
    // which PHP SAPI is running (FPM for web requests, CLI for wp-cli).
    // error_log() is kept as a fallback if the file is not writable.
    if (!@file_put_contents(CFO_SECURITY_LOG, $line . "\n", FILE_APPEND | LOCK_EX)) {
        error_log($line);
    }

    // Alerts go to every address in CFO_ALERT_TO so a warning can't be missed
    // because nobody was watching one mailbox. Falls back to admin_email.
    $to = defined('CFO_ALERT_TO') && CFO_ALERT_TO
        ? array_filter(array_map('trim', explode(',', CFO_ALERT_TO)))
        : [get_option('admin_email')];

    foreach ($to as $addr) {
        if ($addr && !str_ends_with($addr, '.local') && !str_ends_with($addr, '.invalid')) {
            wp_mail($addr, '[CFO CMS] ' . $subject, $line);
        }
    }
}

add_action('user_register', function ($user_id) {
    $u = get_userdata($user_id);
    cfo_security_alert(
        'New user created',
        sprintf('login=%s email=%s roles=%s', $u->user_login, $u->user_email, implode(',', $u->roles))
    );
});

add_action('set_user_role', function ($user_id, $role, $old_roles) {
    if ('administrator' !== $role) {
        return;
    }
    $u = get_userdata($user_id);
    cfo_security_alert(
        'ADMINISTRATOR GRANTED',
        sprintf('login=%s was=%s', $u->user_login, implode(',', (array) $old_roles))
    );
}, 10, 3);

add_action('delete_user', function ($user_id) {
    $u = get_userdata($user_id);
    cfo_security_alert('User deleted', 'login=' . ($u ? $u->user_login : $user_id));
});

add_action('after_password_reset', function ($user) {
    cfo_security_alert('Password reset completed', 'login=' . $user->user_login);
});
