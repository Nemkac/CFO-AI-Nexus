<?php
/**
 * Plugin Name: CFO Mail
 * Description: Sends all WordPress mail through the Brevo HTTPS API instead of
 *              SMTP. Must-use plugin — cannot be deactivated from wp-admin.
 * Version:     1.0
 *
 * Added 2026-08-31.
 *
 * Why not SMTP: DigitalOcean blocks outbound ports 25, 465, 587 and 2525 at
 * the account level on this droplet. Postfix is installed and accepts mail, so
 * wp_mail() returned TRUE while every message sat in the queue timing out —
 * seven were found stuck. That silent-success failure is why WordPress password
 * reset emails never arrived, and why the owner had no way back in when the
 * attacker changed the account password. Port 443 is open, so mail leaves over
 * an HTTPS API instead.
 *
 * Credentials live in wp-config.php (mode 640, root:www-data), never here, so
 * this file is safe to keep in version control.
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('CFO_MAIL_LOG')) {
    define('CFO_MAIL_LOG', '/var/log/cfo-security.log');
}

function cfo_mail_log($message) {
    $line = sprintf('%s [CFO-MAIL] %s', gmdate('c'), $message);
    if (!@file_put_contents(CFO_MAIL_LOG, $line . "\n", FILE_APPEND | LOCK_EX)) {
        error_log($line);
    }
}

/**
 * Short-circuit wp_mail() entirely. Returning a boolean from `pre_wp_mail`
 * stops WordPress from ever reaching PHPMailer, so nothing touches Postfix.
 */
add_filter('pre_wp_mail', function ($null, $atts) {
    if (!defined('CFO_BREVO_API_KEY') || !CFO_BREVO_API_KEY) {
        // Deliberately report failure rather than success. A silent TRUE is
        // what hid the broken mail path for months.
        cfo_mail_log('NO TRANSPORT CONFIGURED — mail not sent to '
            . (is_array($atts['to']) ? implode(',', $atts['to']) : $atts['to']));
        return false;
    }

    $to = $atts['to'];
    if (!is_array($to)) {
        $to = array_filter(array_map('trim', explode(',', $to)));
    }

    $recipients = [];
    foreach ($to as $addr) {
        // Accept both "someone@example.com" and "Name <someone@example.com>".
        if (preg_match('/^(.*)<(.+)>$/', $addr, $m)) {
            $recipients[] = ['name' => trim($m[1], " \t\"'"), 'email' => trim($m[2])];
        } else {
            $recipients[] = ['email' => trim($addr)];
        }
    }

    $from      = defined('CFO_MAIL_FROM') ? CFO_MAIL_FROM : get_option('admin_email');
    $from_name = defined('CFO_MAIL_FROM_NAME') ? CFO_MAIL_FROM_NAME : 'CFO AI Nexus CMS';

    $body = [
        'sender'      => ['email' => $from, 'name' => $from_name],
        'to'          => $recipients,
        'subject'     => (string) $atts['subject'],
        'textContent' => (string) $atts['message'],
    ];

    $response = wp_remote_post('https://api.brevo.com/v3/smtp/email', [
        'timeout' => 15,
        'headers' => [
            'api-key'      => CFO_BREVO_API_KEY,
            'content-type' => 'application/json',
            'accept'       => 'application/json',
        ],
        'body' => wp_json_encode($body),
    ]);

    if (is_wp_error($response)) {
        cfo_mail_log('SEND FAILED (transport): ' . $response->get_error_message());
        return false;
    }

    $code = wp_remote_retrieve_response_code($response);
    if ($code < 200 || $code >= 300) {
        cfo_mail_log(sprintf('SEND FAILED (HTTP %d): %s', $code,
            substr(wp_remote_retrieve_body($response), 0, 300)));
        return false;
    }

    cfo_mail_log(sprintf('sent to %s | subject=%s',
        implode(',', wp_list_pluck($recipients, 'email')),
        substr((string) $atts['subject'], 0, 80)));

    return true;
}, 10, 2);
