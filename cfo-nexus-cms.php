<?php
/**
 * Plugin Name: CFO AI Nexus CMS
 * Description: Custom post types for Speakers and Vendors, editable Stages, with REST API support.
 * Version: 1.1
 */

if (!defined('ABSPATH')) exit;

// ─── Register Custom Post Types ────────────────────────────────────────────

add_action('init', function () {
    register_post_type('speaker', [
        'labels' => [
            'name'          => 'Speakers',
            'singular_name' => 'Speaker',
            'add_new_item'  => 'Add New Speaker',
            'edit_item'     => 'Edit Speaker',
        ],
        'public'       => true,
        'show_in_rest' => true,
        'rest_base'    => 'speakers',
        'supports'     => ['title', 'thumbnail'],
        'menu_icon'    => 'dashicons-microphone',
    ]);

    register_post_type('vendor', [
        'labels' => [
            'name'          => 'Vendors',
            'singular_name' => 'Vendor',
            'add_new_item'  => 'Add New Vendor',
            'edit_item'     => 'Edit Vendor',
        ],
        'public'       => true,
        'show_in_rest' => true,
        'rest_base'    => 'vendors',
        'supports'     => ['title', 'thumbnail'],
        'menu_icon'    => 'dashicons-store',
    ]);
});

// ─── Allow ordering by menu_order in REST API ──────────────────────────────

add_filter('rest_speaker_collection_params', function ($params) {
    $params['orderby']['enum'][] = 'menu_order';
    return $params;
});

add_filter('rest_vendor_collection_params', function ($params) {
    $params['orderby']['enum'][] = 'menu_order';
    return $params;
});

// ─── Register Meta Fields (exposed in REST API) ────────────────────────────

add_action('init', function () {
    $speaker_fields = [
        'speaker_name'   => ['type' => 'string'],
        'speaker_role'   => ['type' => 'string'],
        'speaker_stages' => ['type' => 'array', 'items' => ['type' => 'string']],
        'speaker_link'   => ['type' => 'string'],
    ];
    foreach ($speaker_fields as $key => $schema) {
        register_post_meta('speaker', $key, [
            'type'         => $schema['type'],
            'single'       => true,
            'show_in_rest' => isset($schema['items'])
                ? ['schema' => ['type' => 'array', 'items' => $schema['items']]]
                : true,
        ]);
    }

    $vendor_fields = [
        'vendor_description' => ['type' => 'string'],
        'vendor_types'       => ['type' => 'array', 'items' => ['type' => 'string']],
        'vendor_link'        => ['type' => 'string'],
    ];
    foreach ($vendor_fields as $key => $schema) {
        register_post_meta('vendor', $key, [
            'type'         => $schema['type'],
            'single'       => true,
            'show_in_rest' => isset($schema['items'])
                ? ['schema' => ['type' => 'array', 'items' => $schema['items']]]
                : true,
        ]);
    }
});

// ─── Speaker Meta Box ──────────────────────────────────────────────────────

add_action('add_meta_boxes', function () {
    add_meta_box('speaker_details', 'Speaker Details', 'cfo_speaker_meta_box', 'speaker', 'normal', 'high');
    add_meta_box('vendor_details',  'Vendor Details',  'cfo_vendor_meta_box',  'vendor',  'normal', 'high');
});

function cfo_speaker_meta_box($post) {
    wp_nonce_field('cfo_speaker_save', 'cfo_speaker_nonce');
    $name   = get_post_meta($post->ID, 'speaker_name',   true);
    $role   = get_post_meta($post->ID, 'speaker_role',   true);
    $link   = get_post_meta($post->ID, 'speaker_link',   true);
    $stages_url = admin_url('edit.php?post_type=speaker&page=cfo-stages');
    ?>
    <style>.cfo-field{margin:12px 0}.cfo-field label{font-weight:600;display:block;margin-bottom:4px}.cfo-field input,.cfo-field textarea{width:100%}.cfo-field input[type=checkbox]{width:auto;margin:0}.cfo-required{color:red}</style>
    <div class="cfo-field">
        <label>Speaker Name <span class="cfo-required">*</span></label>
        <input type="text" name="speaker_name" value="<?= esc_attr($name) ?>" required>
    </div>
    <div class="cfo-field">
        <label>Role / Title <span class="cfo-required">*</span></label>
        <input type="text" name="speaker_role" value="<?= esc_attr($role) ?>" placeholder="e.g. Founder of CFO AI Nexus">
    </div>
    <div class="cfo-field">
        <label>Stage(s)</label>
        <?php foreach (cfo_stages_get() as $stage): ?>
            <label style="font-weight:normal;display:flex;gap:6px;align-items:center;margin:4px 0">
                <input type="checkbox" name="speaker_stages[]" value="<?= esc_attr($stage['id']) ?>" <?= in_array($post->ID, $stage['speakers'], true) ? 'checked' : '' ?>>
                <?= esc_html($stage['name']) ?>
            </label>
        <?php endforeach; ?>
        <p style="color:#888;font-size:12px;margin:4px 0 0">A speaker who is on no stage is not shown on the website. Newly ticked stages add the speaker at the end — <a href="<?= esc_url($stages_url) ?>">manage stages and speaker order</a>.</p>
    </div>
    <div class="cfo-field">
        <label>LinkedIn URL <span style="font-weight:normal;color:#888">(optional)</span></label>
        <input type="url" name="speaker_link" value="<?= esc_attr($link) ?>">
    </div>
    <p style="color:#888;font-size:12px">⚠️ Set the <strong>Featured Image</strong> (top right) — this is the speaker's photo.</p>
    <?php
}

function cfo_vendor_meta_box($post) {
    wp_nonce_field('cfo_vendor_save', 'cfo_vendor_nonce');
    $description = get_post_meta($post->ID, 'vendor_description', true);
    $types       = get_post_meta($post->ID, 'vendor_types',       true) ?: [];
    $link        = get_post_meta($post->ID, 'vendor_link',        true);

    $all_types = ['Accounting & ERP', 'Financial Close', 'FP&A', 'Spend Management', 'AR/AP Automation', 'Global Payments', 'Treasury'];
    ?>
    <style>.cfo-field{margin:12px 0}.cfo-field label{font-weight:600;display:block;margin-bottom:4px}.cfo-field input,.cfo-field textarea{width:100%}.cfo-required{color:red}</style>
    <div class="cfo-field">
        <label>Description <span class="cfo-required">*</span></label>
        <textarea name="vendor_description" rows="4"><?= esc_textarea($description) ?></textarea>
    </div>
    <div class="cfo-field">
        <label>Category / Type(s) <span class="cfo-required">* — select at least one</span></label>
        <?php foreach ($all_types as $type): ?>
            <label style="font-weight:normal;display:flex;gap:6px;align-items:center;margin:4px 0">
                <input type="checkbox" name="vendor_types[]" value="<?= esc_attr($type) ?>" <?= in_array($type, $types) ? 'checked' : '' ?>>
                <?= esc_html($type) ?>
            </label>
        <?php endforeach; ?>
    </div>
    <div class="cfo-field">
        <label>Website URL <span class="cfo-required">*</span></label>
        <input type="url" name="vendor_link" value="<?= esc_attr($link) ?>">
    </div>
    <p style="color:#888;font-size:12px">⚠️ Set the <strong>Featured Image</strong> (top right) — this is the vendor logo.</p>
    <?php
}

// ─── Save Meta (with validation) ──────────────────────────────────────────

add_action('save_post_speaker', function ($post_id) {
    if (!isset($_POST['cfo_speaker_nonce']) || !wp_verify_nonce($_POST['cfo_speaker_nonce'], 'cfo_speaker_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

    $name    = sanitize_text_field($_POST['speaker_name']   ?? '');
    $role    = sanitize_text_field($_POST['speaker_role']   ?? '');
    $checked = array_map('sanitize_key', (array) ($_POST['speaker_stages'] ?? []));
    $link    = esc_url_raw($_POST['speaker_link'] ?? '');

    // Validation — redirect back with error if required fields missing
    if (empty($name) || empty($role)) {
        set_transient('cfo_speaker_error_' . $post_id, 'Speaker Name and Role are required.', 30);
        return;
    }

    update_post_meta($post_id, 'speaker_name',   $name);
    update_post_meta($post_id, 'speaker_role',   $role);
    update_post_meta($post_id, 'speaker_link',   $link);

    // Join newly ticked stages at the end, leave unticked ones; other speakers keep their order.
    $post_id = (int) $post_id;
    $stages  = cfo_stages_get();
    foreach ($stages as &$stage) {
        $on  = in_array($stage['id'], $checked, true);
        $has = in_array($post_id, $stage['speakers'], true);
        if ($on && !$has) $stage['speakers'][] = $post_id;
        if (!$on && $has) $stage['speakers'] = array_values(array_diff($stage['speakers'], [$post_id]));
    }
    unset($stage);
    cfo_stages_update($stages);
});

add_action('save_post_vendor', function ($post_id) {
    if (!isset($_POST['cfo_vendor_nonce']) || !wp_verify_nonce($_POST['cfo_vendor_nonce'], 'cfo_vendor_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

    $description = sanitize_textarea_field($_POST['vendor_description'] ?? '');
    $types       = array_map('sanitize_text_field', $_POST['vendor_types'] ?? []);
    $link        = esc_url_raw($_POST['vendor_link'] ?? '');

    if (empty($description) || empty($types) || empty($link)) {
        set_transient('cfo_vendor_error_' . $post_id, 'Description, at least one Type, and Website URL are required.', 30);
        return;
    }

    update_post_meta($post_id, 'vendor_description', $description);
    update_post_meta($post_id, 'vendor_types',       $types);
    update_post_meta($post_id, 'vendor_link',        $link);
});

// ─── Show admin notices for validation errors ──────────────────────────────

add_action('admin_notices', function () {
    $screen = get_current_screen();
    if (!in_array($screen->post_type, ['speaker', 'vendor'])) return;
    $post_id = get_the_ID() ?: ($_GET['post'] ?? 0);
    foreach (['cfo_speaker_error_', 'cfo_vendor_error_'] as $prefix) {
        $error = get_transient($prefix . $post_id);
        if ($error) {
            echo "<div class='notice notice-error'><p>$error</p></div>";
            delete_transient($prefix . $post_id);
        }
    }
});

// ─── CORS headers for local dev ────────────────────────────────────────────

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
});

// ─── Include full image URL in REST response ───────────────────────────────

// ─── Include image URL + meta fields in REST response ─────────────────────

function cfo_add_featured_image_url($response, $post, $request) {
    $image_id  = get_post_thumbnail_id($post->ID);
    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'full') : '';
    $response->data['featured_image_url'] = $image_url;
    return $response;
}

function cfo_add_speaker_meta($response, $post, $request) {
    cfo_add_featured_image_url($response, $post, $request);
    $response->data['speaker_name']   = get_post_meta($post->ID, 'speaker_name',   true) ?: '';
    $response->data['speaker_role']   = get_post_meta($post->ID, 'speaker_role',   true) ?: '';
    $response->data['speaker_stages'] = get_post_meta($post->ID, 'speaker_stages', true) ?: [];
    $response->data['speaker_link']   = get_post_meta($post->ID, 'speaker_link',   true) ?: '';
    return $response;
}

function cfo_add_vendor_meta($response, $post, $request) {
    cfo_add_featured_image_url($response, $post, $request);
    $response->data['vendor_description'] = get_post_meta($post->ID, 'vendor_description', true) ?: '';
    $response->data['vendor_types']       = get_post_meta($post->ID, 'vendor_types',       true) ?: [];
    $response->data['vendor_link']        = get_post_meta($post->ID, 'vendor_link',         true) ?: '';
    return $response;
}

add_filter('rest_prepare_speaker', 'cfo_add_speaker_meta', 10, 3);
add_filter('rest_prepare_vendor',  'cfo_add_vendor_meta',  10, 3);
// ─── Stages ────────────────────────────────────────────────────────────────
// An ordered list of stages kept in one option. Each stage holds its own
// ordered list of speaker post IDs, and the site renders it exactly as stored:
// [ ['id' => 'stage-ab12cd34', 'name' => 'Main Stage', 'speakers' => [6, 8]], ... ]

const CFO_STAGES_OPTION = 'cfo_stages';

function cfo_stages_new_id() {
    return 'stage-' . strtolower(wp_generate_password(8, false));
}

function cfo_stages_get() {
    $stages = get_option(CFO_STAGES_OPTION, null);
    if (!is_array($stages)) {
        $stages = cfo_stages_seed();
        add_option(CFO_STAGES_OPTION, $stages);
    }
    return array_map(function ($stage) {
        $stage['speakers'] = array_map('intval', $stage['speakers'] ?? []);
        return $stage;
    }, $stages);
}

// First run only: rebuild the stages that used to be hard-coded on the site,
// filled from each speaker's stage tags in the order the site showed them.
function cfo_stages_seed() {
    $names  = ['Main Stage', 'FP&A', 'ERP & Accounting', 'Treasury', 'AP/Spend Management', 'AR/Rev. Rec.'];
    // Tags still on speakers from before the October 2026 rename.
    $legacy = [
        'Financial Close & Consolidation' => 'ERP & Accounting',
        'Treasury & Cash Management'      => 'Treasury',
        'AR/AP Automation'                => 'AP/Spend Management',
    ];

    $stages = [];
    foreach ($names as $name) {
        $stages[$name] = ['id' => cfo_stages_new_id(), 'name' => $name, 'speakers' => []];
    }

    $ids = (new WP_Query([
        'post_type'      => 'speaker',
        'post_status'    => ['publish', 'future', 'draft', 'pending', 'private'],
        'posts_per_page' => -1,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
        'fields'         => 'ids',
    ]))->posts;

    foreach ($ids as $id) {
        foreach ((array) (get_post_meta($id, 'speaker_stages', true) ?: []) as $tag) {
            $name = $legacy[$tag] ?? $tag;
            if (isset($stages[$name]) && !in_array((int) $id, $stages[$name]['speakers'], true)) {
                $stages[$name]['speakers'][] = (int) $id;
            }
        }
    }
    return array_values($stages);
}

function cfo_stages_update(array $stages) {
    $stages = array_values($stages);
    update_option(CFO_STAGES_OPTION, $stages);

    // Keep the older speaker_stages meta (exposed on /wp/v2/speakers) in step with the stages.
    $ids = get_posts(['post_type' => 'speaker', 'post_status' => 'any', 'posts_per_page' => -1, 'fields' => 'ids']);
    foreach ($ids as $id) {
        $names = [];
        foreach ($stages as $stage) {
            if (in_array((int) $id, $stage['speakers'], true)) $names[] = $stage['name'];
        }
        update_post_meta($id, 'speaker_stages', $names);
    }
}

// A permanently deleted speaker leaves every stage. Trashed ones stay, so a restore puts them back.
add_action('deleted_post', function ($post_id, $post) {
    if (!$post || $post->post_type !== 'speaker') return;
    $stages = get_option(CFO_STAGES_OPTION, null);
    if (!is_array($stages)) return;
    foreach ($stages as &$stage) {
        $stage['speakers'] = array_values(array_diff(array_map('intval', $stage['speakers']), [(int) $post_id]));
    }
    unset($stage);
    update_option(CFO_STAGES_OPTION, $stages);
}, 10, 2);

// ─── REST endpoint: /wp-json/cfo/v1/stages ─────────────────────────────────

add_action('rest_api_init', function () {
    register_rest_route('cfo/v1', '/stages', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $out = [];
            foreach (cfo_stages_get() as $stage) {
                $speakers = [];
                foreach ($stage['speakers'] as $id) {
                    $post = get_post($id);
                    if (!$post || $post->post_type !== 'speaker' || $post->post_status !== 'publish') continue;
                    $image_id   = get_post_thumbnail_id($id);
                    $speakers[] = [
                        'image'   => ($image_id ? wp_get_attachment_image_url($image_id, 'full') : '') ?: '',
                        'speaker' => get_post_meta($id, 'speaker_name', true) ?: '',
                        'role'    => get_post_meta($id, 'speaker_role', true) ?: '',
                        'title'   => get_the_title($post),
                        'link'    => get_post_meta($id, 'speaker_link', true) ?: '',
                    ];
                }
                $out[] = ['id' => $stage['id'], 'name' => $stage['name'], 'speakers' => $speakers];
            }
            return $out;
        },
    ]);
});

// ─── Stages admin page (Speakers → Stages) ─────────────────────────────────

add_action('admin_menu', function () {
    add_submenu_page('edit.php?post_type=speaker', 'Stages', 'Stages', 'edit_posts', 'cfo-stages', 'cfo_stages_render_page');
});

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook !== 'speaker_page_cfo-stages') return;
    wp_enqueue_script('jquery-ui-sortable');
});

function cfo_stages_render_page() {
    if (!current_user_can('edit_posts')) return;

    $speakers = [];
    $posts = get_posts([
        'post_type'      => 'speaker',
        'post_status'    => ['publish', 'future', 'draft', 'pending', 'private', 'trash'],
        'posts_per_page' => -1,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    ]);
    foreach ($posts as $p) {
        $speakers[] = [
            'id'     => $p->ID,
            'name'   => get_post_meta($p->ID, 'speaker_name', true) ?: '(no name)',
            'title'  => html_entity_decode(get_the_title($p), ENT_QUOTES, 'UTF-8'),
            'status' => $p->post_status,
            'thumb'  => get_the_post_thumbnail_url($p, 'thumbnail') ?: '',
        ];
    }
    ?>
    <style>
        .cfo-stages-wrap{max-width:860px}
        .cfo-stage{background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:16px;margin:16px 0}
        .cfo-stage-head{display:flex;gap:10px;align-items:center}
        .cfo-stage-name{flex:1;font-size:15px;font-weight:600}
        .cfo-handle{cursor:move;color:#8c8f94}
        .cfo-speakers{margin:12px 0;min-height:44px;border:1px dashed #dcdcde;border-radius:6px;padding:6px}
        .cfo-speakers:empty::before{content:'No speakers on this stage yet — add one below or drag one here.';display:block;color:#8c8f94;padding:8px}
        .cfo-speaker{display:flex;gap:10px;align-items:center;background:#f6f7f7;border:1px solid #eee;border-radius:6px;padding:6px 10px;margin:4px 0}
        .cfo-speaker img,.cfo-speaker .cfo-noimg{width:36px;height:36px;border-radius:50%;object-fit:cover;background:#dcdcde;flex:none}
        .cfo-speaker-text{flex:1;display:flex;flex-direction:column;min-width:0}
        .cfo-speaker-text span{color:#646970;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .cfo-status{font-size:11px;background:#fcf0e3;color:#8a4b0f;border-radius:4px;padding:2px 6px;flex:none}
        .cfo-placeholder{height:46px;border:2px dashed #2271b1;border-radius:6px;margin:4px 0;background:#f0f6fc}
        .cfo-stage-placeholder{height:120px;border:2px dashed #2271b1;border-radius:8px;margin:16px 0}
        .cfo-add{display:flex;gap:8px}
        .cfo-add select{flex:1;max-width:none}
    </style>
    <div class="wrap cfo-stages-wrap">
        <h1>Stages</h1>
        <p>Stages and their speakers appear on the website exactly in this order. Drag <span class="dashicons dashicons-menu"></span> to reorder stages, to reorder speakers, or to move a speaker to another stage. A speaker can be on more than one stage.</p>
        <?php if (isset($_GET['updated'])): ?>
            <div class="notice notice-success is-dismissible"><p>Stages saved.</p></div>
        <?php endif; ?>
        <?php if (isset($_GET['error'])): ?>
            <div class="notice notice-error"><p>Nothing was saved: every stage needs a name.</p></div>
        <?php endif; ?>

        <form id="cfo-stages-form" method="post" action="<?= esc_url(admin_url('admin-post.php')) ?>">
            <input type="hidden" name="action" value="cfo_stages_save">
            <input type="hidden" name="cfo_stages_json" id="cfo_stages_json">
            <?php wp_nonce_field('cfo_stages_save', 'cfo_stages_nonce'); ?>
            <div id="cfo-stages"></div>
            <p><button type="button" class="button" id="cfo-add-stage">+ Add stage</button></p>
            <?php submit_button('Save stages'); ?>
        </form>
    </div>

    <script>
    jQuery(function ($) {
        const stages   = <?= wp_json_encode(cfo_stages_get()) ?>;
        const speakers = <?= wp_json_encode($speakers) ?>;
        const byId = {};
        speakers.forEach(function (s) { byId[s.id] = s; });
        const statusLabels = { draft: 'Draft', pending: 'Pending', future: 'Scheduled', 'private': 'Private', trash: 'In trash' };

        const wrap = $('#cfo-stages');
        let dirty = false;
        function markDirty() { dirty = true; }
        window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

        function speakerItem(id) {
            const s = byId[id];
            if (!s) return null;
            const li = $('<li class="cfo-speaker">').attr('data-id', s.id);
            li.append('<span class="cfo-handle dashicons dashicons-menu" title="Drag to reorder or move to another stage"></span>');
            li.append(s.thumb ? $('<img alt="">').attr('src', s.thumb) : $('<span class="cfo-noimg"></span>'));
            li.append($('<div class="cfo-speaker-text">').append($('<strong>').text(s.name), $('<span>').text(s.title)));
            if (statusLabels[s.status]) li.append($('<span class="cfo-status">').text(statusLabels[s.status] + ' — not shown on site'));
            li.append('<button type="button" class="button-link cfo-remove-speaker">Remove</button>');
            return li;
        }

        function makeSortable(list) {
            list.sortable({
                handle: '.cfo-handle',
                connectWith: '.cfo-speakers',
                placeholder: 'cfo-placeholder',
                update: markDirty,
                receive: function (e, ui) {
                    if ($(this).children('[data-id="' + ui.item.attr('data-id') + '"]').length > 1) {
                        $(ui.sender).sortable('cancel');
                        alert('This speaker is already on that stage.');
                    }
                },
            });
        }

        function stageCard(stage) {
            const card = $('<div class="cfo-stage">').attr('data-id', stage.id);
            card.append($('<div class="cfo-stage-head">').append(
                '<span class="cfo-handle dashicons dashicons-menu" title="Drag to reorder stages"></span>',
                $('<input type="text" class="cfo-stage-name" required placeholder="Stage name">').val(stage.name),
                '<button type="button" class="button-link button-link-delete cfo-delete-stage">Delete stage</button>'
            ));

            const list = $('<ul class="cfo-speakers">');
            stage.speakers.forEach(function (id) { list.append(speakerItem(id)); });
            card.append(list);
            makeSortable(list);

            const select = $('<select>').append('<option value="">Add a speaker to this stage…</option>');
            speakers
                .filter(function (s) { return s.status !== 'trash'; })
                .slice()
                .sort(function (a, b) { return a.name.localeCompare(b.name); })
                .forEach(function (s) {
                    const suffix = statusLabels[s.status] ? ' (' + statusLabels[s.status] + ')' : '';
                    select.append($('<option>').val(s.id).text(s.name + ' — ' + s.title + suffix));
                });
            const addBtn = $('<button type="button" class="button">Add</button>').on('click', function () {
                const id = select.val();
                if (!id) return;
                if (list.children('[data-id="' + id + '"]').length) { alert('This speaker is already on this stage.'); return; }
                list.append(speakerItem(id));
                select.val('');
                markDirty();
            });
            card.append($('<div class="cfo-add">').append(select, addBtn));
            return card;
        }

        stages.forEach(function (stage) { wrap.append(stageCard(stage)); });
        wrap.sortable({ handle: '.cfo-stage-head .cfo-handle', items: '> .cfo-stage', placeholder: 'cfo-stage-placeholder', update: markDirty });

        $('#cfo-add-stage').on('click', function () {
            const card = stageCard({ id: '', name: '', speakers: [] });
            wrap.append(card);
            card.find('.cfo-stage-name').trigger('focus');
            markDirty();
        });

        wrap.on('click', '.cfo-remove-speaker', function () { $(this).closest('.cfo-speaker').remove(); markDirty(); });
        wrap.on('click', '.cfo-delete-stage', function () {
            const card = $(this).closest('.cfo-stage');
            const name = card.find('.cfo-stage-name').val() || 'this stage';
            if (!confirm('Delete "' + name + '"? Its speakers are not deleted — they just stop appearing under this stage.')) return;
            card.remove();
            markDirty();
        });
        wrap.on('input', '.cfo-stage-name', markDirty);

        $('#cfo-stages-form').on('submit', function () {
            const data = wrap.children('.cfo-stage').map(function () {
                return {
                    id: $(this).attr('data-id'),
                    name: $(this).find('.cfo-stage-name').val().trim(),
                    speakers: $(this).find('.cfo-speaker').map(function () { return parseInt($(this).attr('data-id'), 10); }).get(),
                };
            }).get();
            $('#cfo_stages_json').val(JSON.stringify(data));
            dirty = false;
        });
    });
    </script>
    <?php
}

add_action('admin_post_cfo_stages_save', function () {
    if (!current_user_can('edit_posts')) wp_die('Forbidden');
    if (!isset($_POST['cfo_stages_nonce']) || !wp_verify_nonce($_POST['cfo_stages_nonce'], 'cfo_stages_save')) wp_die('Bad nonce');

    $page = admin_url('edit.php?post_type=speaker&page=cfo-stages');
    $raw  = json_decode(wp_unslash($_POST['cfo_stages_json'] ?? ''), true);
    if (!is_array($raw)) wp_die('Invalid stages data.');

    $valid = array_flip(get_posts(['post_type' => 'speaker', 'post_status' => ['publish', 'future', 'draft', 'pending', 'private', 'trash'], 'posts_per_page' => -1, 'fields' => 'ids']));

    $stages = [];
    $seen   = [];
    foreach ($raw as $row) {
        $name = sanitize_text_field($row['name'] ?? '');
        if ($name === '') {
            wp_safe_redirect(add_query_arg('error', 'name', $page));
            exit;
        }
        $id = sanitize_key($row['id'] ?? '');
        if ($id === '' || isset($seen[$id])) $id = cfo_stages_new_id();
        $seen[$id] = true;

        $speaker_ids = [];
        foreach ((array) ($row['speakers'] ?? []) as $sid) {
            $sid = (int) $sid;
            if (isset($valid[$sid]) && !in_array($sid, $speaker_ids, true)) $speaker_ids[] = $sid;
        }
        $stages[] = ['id' => $id, 'name' => $name, 'speakers' => $speaker_ids];
    }

    cfo_stages_update($stages);
    wp_safe_redirect(add_query_arg('updated', '1', $page));
    exit;
});
