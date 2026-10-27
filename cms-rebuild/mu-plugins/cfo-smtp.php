<?php
/**
 * Plugin Name: CFO SMTP
 * Description: Routes all WordPress mail through an authenticated SMTP relay.
 *              Must-use plugin — loads before everything else and cannot be
 *              deactivated from wp-admin.
 * Version:     1.0
 *
 * Added 2026-08-31. DigitalOcean blocks outbound port 25, so PHP's mail()
 * silently fails on this droplet. That is why WordPress password resets never
 * arrived and why the owner could not recover the account when the attacker
 * changed the password. Credentials live in wp-config.php (mode 640,
 * root:www-data) rather than here, so this file stays safe to keep in git.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('phpmailer_init', function ($phpmailer) {
    // CFO_SMTP_ENABLED is the kill switch. DigitalOcean blocks outbound 25/465/
    // 587 at the account level, so with SMTP on but unreachable every wp_mail()
    // call blocks for the full connection timeout — password resets appear to
    // hang and admin pages crawl. Leave this false until a transport works.
    if (!defined('CFO_SMTP_ENABLED') || !CFO_SMTP_ENABLED) {
        return;
    }
    if (!defined('CFO_SMTP_HOST') || !defined('CFO_SMTP_USER') || !defined('CFO_SMTP_PASS')) {
        return;
    }

    $phpmailer->isSMTP();
    // Fail fast rather than tying up a PHP worker if the port is filtered.
    $phpmailer->Timeout = 8;
    $phpmailer->Host        = CFO_SMTP_HOST;
    $phpmailer->Port        = defined('CFO_SMTP_PORT') ? CFO_SMTP_PORT : 587;
    $phpmailer->SMTPAuth    = true;
    $phpmailer->Username    = CFO_SMTP_USER;
    $phpmailer->Password    = CFO_SMTP_PASS;
    $phpmailer->SMTPSecure  = 'tls';   // STARTTLS on 587
    $phpmailer->SMTPAutoTLS = true;

    // Gmail rewrites any From address that is not the authenticated account,
    // so setting it explicitly avoids a mismatch between the envelope and the
    // header that some receivers score as spoofing.
    $phpmailer->setFrom(CFO_SMTP_USER, 'CFO AI Nexus CMS', false);
    $phpmailer->Sender = CFO_SMTP_USER;
});

// Keep the From header consistent for mail generated elsewhere in WordPress.
add_filter('wp_mail_from', function ($email) {
    return defined('CFO_SMTP_USER') ? CFO_SMTP_USER : $email;
});

add_filter('wp_mail_from_name', function () {
    return 'CFO AI Nexus CMS';
});

// Record delivery failures where we can actually see them — the same log the
// account tripwire and nightly maintenance write to.
add_action('wp_mail_failed', function ($error) {
    $line = sprintf(
        '%s [CFO-SECURITY] EMAIL SEND FAILED | %s',
        gmdate('c'),
        is_wp_error($error) ? $error->get_error_message() : 'unknown error'
    );
    if (!@file_put_contents('/var/log/cfo-security.log', $line . "\n", FILE_APPEND | LOCK_EX)) {
        error_log($line);
    }
});
