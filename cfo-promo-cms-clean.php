<?php
/**
 * Plugin Name: CFO Nexus Promo CMS
 * Description: Promo site content management
 * Version: 1.0
 */
if (!defined('ABSPATH')) exit;

// ============================================================================
// HELPERS
// ============================================================================

function cfo_promo_get($key, $default = '') {
    return get_option('cfo_promo_' . $key, $default);
}
function cfo_promo_save($key, $value) {
    update_option('cfo_promo_' . $key, $value);
}

// ============================================================================
// CPTs — NUMBER CARDS & SESSION CARDS
// ============================================================================

add_action('init', function () {
    register_post_type('promo_number', [
        'labels'       => ['name'=>'Number Cards','singular_name'=>'Number Card','add_new_item'=>'Add Number Card','edit_item'=>'Edit Number Card'],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => false,
        'supports'     => ['title', 'page-attributes'],
    ]);
    register_post_type('promo_session', [
        'labels'       => ['name'=>'Session Cards','singular_name'=>'Session Card','add_new_item'=>'Add Session Card','edit_item'=>'Edit Session Card'],
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => false,
        'supports'     => ['title', 'page-attributes'],
    ]);
});

// Meta boxes
add_action('add_meta_boxes', function () {
    add_meta_box('promo_number_meta',  'Card Details', 'cfo_number_meta_box',  'promo_number',  'normal', 'high');
    add_meta_box('promo_session_meta', 'Card Details', 'cfo_session_meta_box', 'promo_session', 'normal', 'high');
    add_meta_box('promo_order_tip', 'Display Order', 'cfo_order_tip_box', ['promo_number','promo_session'], 'side', 'high');
});

function cfo_number_meta_box($post) {
    wp_nonce_field('cfo_number', 'cfo_number_nonce');
    $number = get_post_meta($post->ID, 'card_number', true);
    $label  = get_post_meta($post->ID, 'card_label',  true);
    $desc   = get_post_meta($post->ID, 'card_description', true);
    echo '<p style="color:#666;font-size:12px">The <strong>Title</strong> field above is for internal reference only.</p>';
    echo '<table class="form-table">';
    echo '<tr><th><label>Number</label></th><td><input type="text" name="card_number" value="'.esc_attr($number).'" class="regular-text" placeholder="e.g. 85%" /></td></tr>';
    echo '<tr><th><label>Label</label></th><td><input type="text" name="card_label" value="'.esc_attr($label).'" class="regular-text" placeholder="e.g. AI Adoption Rate" /></td></tr>';
    echo '<tr><th><label>Description</label></th><td><textarea name="card_description" rows="3" class="large-text">'.esc_textarea($desc).'</textarea></td></tr>';
    echo '</table>';
}

function cfo_session_meta_box($post) {
    wp_nonce_field('cfo_session', 'cfo_session_nonce');
    $icon = get_post_meta($post->ID, 'card_icon_url', true);
    $desc = get_post_meta($post->ID, 'card_description', true);
    ?>
    <p style="color:#666;font-size:12px">The <strong>Title</strong> field above is the card title shown on the site.</p>
    <table class="form-table">
        <tr>
            <th><label>Icon</label></th>
            <td>
                <div style="display:flex;gap:8px;align-items:center">
                    <input type="text" name="card_icon_url" id="cfo_icon_url" value="<?php echo esc_url($icon); ?>" class="regular-text" />
                    <button type="button" class="button" id="cfo_choose_icon">Choose</button>
                </div>
                <div id="cfo_icon_preview" style="margin-top:8px"><?php if ($icon): ?><img src="<?php echo esc_url($icon); ?>" style="max-height:60px" /><?php endif; ?></div>
            </td>
        </tr>
        <tr><th><label>Description</label></th><td><textarea name="card_description" rows="3" class="large-text"><?php echo esc_textarea($desc); ?></textarea></td></tr>
    </table>
    <script>
    jQuery(function($){
        $('#cfo_choose_icon').on('click', function(){
            var frame = wp.media({title:'Select Icon', multiple:false});
            frame.on('select', function(){
                var url = frame.state().get('selection').first().toJSON().url;
                $('#cfo_icon_url').val(url);
                $('#cfo_icon_preview').html('<img src="'+url+'" style="max-height:60px">');
            });
            frame.open();
        });
    });
    </script>
    <?php
}

function cfo_order_tip_box() {
    echo '<p style="font-size:12px;color:#666">Use the <strong>Order</strong> field in the "Page Attributes" box below to set the display order. Lower numbers appear first.</p>';
}

add_action('save_post_promo_number', function ($post_id) {
    if (!isset($_POST['cfo_number_nonce']) || !wp_verify_nonce($_POST['cfo_number_nonce'], 'cfo_number')) return;
    update_post_meta($post_id, 'card_number',      sanitize_text_field($_POST['card_number'] ?? ''));
    update_post_meta($post_id, 'card_label',       sanitize_text_field($_POST['card_label'] ?? ''));
    update_post_meta($post_id, 'card_description', sanitize_textarea_field($_POST['card_description'] ?? ''));
});

add_action('save_post_promo_session', function ($post_id) {
    if (!isset($_POST['cfo_session_nonce']) || !wp_verify_nonce($_POST['cfo_session_nonce'], 'cfo_session')) return;
    update_post_meta($post_id, 'card_icon_url',    esc_url_raw($_POST['card_icon_url'] ?? ''));
    update_post_meta($post_id, 'card_description', sanitize_textarea_field($_POST['card_description'] ?? ''));
});

// List columns
add_filter('manage_promo_number_posts_columns', fn($c) => ['cb'=>$c['cb'],'title'=>'Reference','card_number'=>'Number','card_label'=>'Label','order'=>'Order']);
add_action('manage_promo_number_posts_custom_column', function ($col, $id) {
    if ($col === 'card_number') echo esc_html(get_post_meta($id, 'card_number', true));
    if ($col === 'card_label')  echo esc_html(get_post_meta($id, 'card_label',  true));
    if ($col === 'order')       echo esc_html(get_post_field('menu_order', $id));
}, 10, 2);

add_filter('manage_promo_session_posts_columns', fn($c) => ['cb'=>$c['cb'],'title'=>'Card Title','card_description'=>'Description','order'=>'Order']);
add_action('manage_promo_session_posts_custom_column', function ($col, $id) {
    if ($col === 'card_description') echo esc_html(substr(get_post_meta($id, 'card_description', true), 0, 80)).'...';
    if ($col === 'order') echo esc_html(get_post_field('menu_order', $id));
}, 10, 2);

// ============================================================================
// ADMIN MENU
// ============================================================================

add_action('admin_menu', function () {
    add_menu_page('Promo Site', 'Promo Site', 'edit_posts', 'promo-site', 'cfo_promo_hero_page', 'dashicons-megaphone', 25);
    add_submenu_page('promo-site', 'Hero',                    'Hero',                    'edit_posts', 'promo-site',                    'cfo_promo_hero_page');
    add_submenu_page('promo-site', 'Numbers — Cards',         'Numbers — Cards',         'edit_posts', 'edit.php?post_type=promo_number');
    add_submenu_page('promo-site', 'Numbers — Settings',      'Numbers — Settings',      'edit_posts', 'promo-numbers',                 'cfo_promo_numbers_page');
    add_submenu_page('promo-site', 'Inside The Session — Cards',    'Session Cards',     'edit_posts', 'edit.php?post_type=promo_session');
    add_submenu_page('promo-site', 'Inside The Session — Settings', 'Session Settings',  'edit_posts', 'promo-inside',                  'cfo_promo_inside_page');
    add_submenu_page('promo-site', 'Carousel',                'Carousel',                'edit_posts', 'promo-carousel',                'cfo_promo_carousel_page');
    add_submenu_page('promo-site', 'Costs',                   'Costs',                   'edit_posts', 'promo-costs',                   'cfo_promo_costs_page');
    add_submenu_page('promo-site', 'Footer',                  'Footer',                  'edit_posts', 'promo-footer',                  'cfo_promo_footer_page');
});

// ============================================================================
// SETTINGS SAVE
// ============================================================================

add_action('admin_post_cfo_promo_save', function () {
    if (!current_user_can('edit_posts') || !check_admin_referer('cfo_promo_save')) return;
    $section = sanitize_key($_POST['cfo_promo_section'] ?? '');

    $text_fields = [
        'hero' => ['banner_text','conference_datetime','badge','jumbo','subtitle','description','button_text','image','image_caption'],
        'numbers' => ['numbers_title','numbers_subtitle'],
        'inside'  => ['inside_title'],
        'carousel'=> ['carousel_title','carousel_subtitle'],
        'costs'   => ['costs_title','costs_subtitle','costs_without_title','costs_with_title'],
        'footer'  => ['footer_title','footer_subtitle','footer_button_text','footer_button_subtext','footer_copyright','footer_tagline'],
    ];

    if (isset($text_fields[$section])) {
        foreach ($text_fields[$section] as $f) {
            cfo_promo_save($f, sanitize_textarea_field($_POST[$f] ?? ''));
        }
    }

    if ($section === 'carousel') {
        $imgs = array_values(array_slice(array_filter(array_map('esc_url_raw', (array)($_POST['carousel_images'] ?? []))), 0, 7));
        cfo_promo_save('carousel_images_json', json_encode($imgs));
    }

    if ($section === 'costs') {
        $without = array_values(array_filter(array_map('sanitize_textarea_field', (array)($_POST['costs_without_points'] ?? []))));
        $with    = array_values(array_filter(array_map('sanitize_textarea_field', (array)($_POST['costs_with_points'] ?? []))));
        cfo_promo_save('costs_without_points_json', json_encode($without));
        cfo_promo_save('costs_with_points_json',    json_encode($with));
    }

    wp_redirect(add_query_arg('saved', '1', wp_get_referer()));
    exit;
});

// ============================================================================
// PAGE HELPERS
// ============================================================================

function cfo_promo_notice() {
    if (isset($_GET['saved'])) echo '<div class="notice notice-success is-dismissible"><p>Changes saved.</p></div>';
}

function cfo_promo_input($label, $name, $textarea = false) {
    $val = cfo_promo_get($name);
    echo '<tr><th style="width:200px"><label for="'.$name.'">'.esc_html($label).'</label></th><td>';
    if ($textarea) echo '<textarea name="'.$name.'" id="'.$name.'" rows="3" class="large-text">'.esc_textarea($val).'</textarea>';
    else           echo '<textarea name="'.$name.'" id="'.$name.'" rows="3" class="large-text">'.esc_textarea($val).'</textarea>';
    echo '</td></tr>';
}

function cfo_promo_image_row($label, $name) {
    $val = cfo_promo_get($name);
    ?>
    <tr>
        <th style="width:200px"><label><?php echo esc_html($label); ?></label></th>
        <td>
            <div style="display:flex;gap:8px;align-items:center">
                <input type="text" name="<?php echo esc_attr($name); ?>" id="<?php echo esc_attr($name); ?>" value="<?php echo esc_url($val); ?>" class="regular-text" />
                <button type="button" class="button cfo-media-btn" data-target="<?php echo esc_attr($name); ?>">Choose</button>
            </div>
            <?php if ($val): ?><div style="margin-top:8px"><img src="<?php echo esc_url($val); ?>" style="max-height:80px" /></div><?php endif; ?>
        </td>
    </tr>
    <?php
}

function cfo_promo_form_open($section, $redirect) {
    wp_enqueue_media();
    ?>
    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <?php wp_nonce_field('cfo_promo_save'); ?>
        <input type="hidden" name="action" value="cfo_promo_save" />
        <input type="hidden" name="cfo_promo_section" value="<?php echo esc_attr($section); ?>" />
        <input type="hidden" name="_wp_http_referer" value="<?php echo esc_url($redirect); ?>" />
        <table class="form-table">
    <?php
}

function cfo_promo_form_close() {
    echo '</table>';
    submit_button('Save Changes');
    echo '</form>';
    ?>
    <script>
    jQuery(function($){
        $('.cfo-media-btn').on('click', function(){
            var t = $(this).data('target');
            var frame = wp.media({title:'Select Image', multiple:false});
            frame.on('select', function(){
                $('#'+t).val(frame.state().get('selection').first().toJSON().url);
            });
            frame.open();
        });
    });
    </script>
    <?php
}

// ============================================================================
// PAGES
// ============================================================================

function cfo_promo_hero_page() {
    $url = admin_url('admin.php?page=promo-site');
    echo '<div class="wrap"><h1>Hero Section</h1>'; cfo_promo_notice();
    cfo_promo_form_open('hero', $url);
    cfo_promo_input('Banner Text',      'banner_text');
?>
<tr>
    <th style="width:200px"><label for="conference_datetime">Conference Date & Time (UTC)</label></th>
    <td>
        <input type="datetime-local" name="conference_datetime" id="conference_datetime" value="<?php echo esc_attr(cfo_promo_get('conference_datetime')); ?>" />
        <p class="description">Pick the date and time in <strong>UTC</strong>. Example: May 19 at 11:00 AM EST = <strong>2026-05-19T16:00</strong></p>
    </td>
</tr>
<?php


    cfo_promo_input('Badge Text',       'badge');
    cfo_promo_input('Main Heading',     'jumbo');
    cfo_promo_input('Subtitle',         'subtitle');
    cfo_promo_input('Description',      'description', true);
    cfo_promo_input('Button Text',      'button_text');
    cfo_promo_image_row('Hero Image',   'image');
    cfo_promo_input('Text Under Image', 'image_caption');
    cfo_promo_form_close();
    echo '</div>';
}

function cfo_promo_numbers_page() {
    $url = admin_url('admin.php?page=promo-numbers');
    echo '<div class="wrap"><h1>Numbers — Section Settings</h1>'; cfo_promo_notice();
    cfo_promo_form_open('numbers', $url);
    cfo_promo_input('Section Title',    'numbers_title');
    cfo_promo_input('Section Subtitle', 'numbers_subtitle', true);
    cfo_promo_form_close();
    echo '</div>';
}

function cfo_promo_inside_page() {
    $url = admin_url('admin.php?page=promo-inside');
    echo '<div class="wrap"><h1>Inside The Session — Settings</h1>'; cfo_promo_notice();
    cfo_promo_form_open('inside', $url);
    cfo_promo_input('Section Title', 'inside_title');
    cfo_promo_form_close();
    echo '</div>';
}

function cfo_promo_carousel_page() {
    $url    = admin_url('admin.php?page=promo-carousel');
    $images = json_decode(cfo_promo_get('carousel_images_json', '[]'), true) ?: [];
    echo '<div class="wrap"><h1>Carousel</h1>'; cfo_promo_notice();
    wp_enqueue_media();
    ?>
    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <?php wp_nonce_field('cfo_promo_save'); ?>
        <input type="hidden" name="action" value="cfo_promo_save" />
        <input type="hidden" name="cfo_promo_section" value="carousel" />
        <input type="hidden" name="_wp_http_referer" value="<?php echo esc_url($url); ?>" />
        <table class="form-table">
            <?php cfo_promo_input('Section Title', 'carousel_title'); cfo_promo_input('Section Subtitle', 'carousel_subtitle'); ?>
            <tr>
                <th style="width:200px">Images <span style="font-weight:normal;color:#666">(max 7)</span></th>
                <td>
                    <div id="cfo_carousel_images">
                        <?php foreach ($images as $url): ?>
                        <div class="cfo-img-row" style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
                            <input type="text" name="carousel_images[]" value="<?php echo esc_url($url); ?>" class="regular-text" />
                            <button type="button" class="button cfo-pick">Choose</button>
                            <button type="button" class="button cfo-del">Remove</button>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <button type="button" class="button" id="cfo_add_img" <?php echo count($images)>=7?'style="display:none"':''; ?>>+ Add Image</button>
                </td>
            </tr>
        </table>
        <?php submit_button('Save Changes'); ?>
    </form>
    <script>
    jQuery(function($){
        function bind(row){
            row.find('.cfo-pick').on('click',function(){
                var inp=row.find('input');
                var f=wp.media({title:'Select Image',multiple:false});
                f.on('select',function(){ inp.val(f.state().get('selection').first().toJSON().url); });
                f.open();
            });
            row.find('.cfo-del').on('click',function(){ row.remove(); if($('.cfo-img-row').length<7)$('#cfo_add_img').show(); });
        }
        $('.cfo-img-row').each(function(){ bind($(this)); });
        $('#cfo_add_img').on('click',function(){
            if($('.cfo-img-row').length>=7) return;
            var row=$('<div class="cfo-img-row" style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><input type="text" name="carousel_images[]" value="" class="regular-text"/><button type="button" class="button cfo-pick">Choose</button><button type="button" class="button cfo-del">Remove</button></div>');
            $('#cfo_carousel_images').append(row); bind(row);
            if($('.cfo-img-row').length>=7) $(this).hide();
        });
    });
    </script>
    <?php echo '</div>';
}

function cfo_promo_costs_page() {
    $url     = admin_url('admin.php?page=promo-costs');
    $without = json_decode(cfo_promo_get('costs_without_points_json', '[]'), true) ?: [];
    $with    = json_decode(cfo_promo_get('costs_with_points_json',    '[]'), true) ?: [];
    echo '<div class="wrap"><h1>Costs Section</h1>'; cfo_promo_notice();
    ?>
    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <?php wp_nonce_field('cfo_promo_save'); ?>
        <input type="hidden" name="action" value="cfo_promo_save" />
        <input type="hidden" name="cfo_promo_section" value="costs" />
        <input type="hidden" name="_wp_http_referer" value="<?php echo esc_url($url); ?>" />
        <table class="form-table">
            <?php cfo_promo_input('Section Title', 'costs_title'); cfo_promo_input('Section Subtitle', 'costs_subtitle', true); ?>
            <tr><td colspan="2"><hr /><h2 style="margin:4px 0">Left Card — Without</h2></td></tr>
            <?php cfo_promo_input('Left Card Title', 'costs_without_title'); ?>
            <tr>
                <th style="width:200px">Points</th>
                <td>
                    <div id="cfo_without">
                        <?php foreach ($without as $p): ?>
                        <div class="cfo-pt" style="display:flex;gap:8px;margin-bottom:6px">
                            <textarea name="costs_without_points[]" rows="2" class="large-text"><?php echo esc_textarea($p); ?></textarea>
                            <button type="button" class="button cfo-rm">Remove</button>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <button type="button" class="button cfo-add" data-wrap="cfo_without" data-name="costs_without_points[]">+ Add Point</button>
                </td>
            </tr>
            <tr><td colspan="2"><hr /><h2 style="margin:4px 0">Right Card — With</h2></td></tr>
            <?php cfo_promo_input('Right Card Title', 'costs_with_title'); ?>
            <tr>
                <th style="width:200px">Points</th>
                <td>
                    <div id="cfo_with">
                        <?php foreach ($with as $p): ?>
                        <div class="cfo-pt" style="display:flex;gap:8px;margin-bottom:6px">
                            <textarea name="costs_with_points[]" rows="2" class="large-text"><?php echo esc_textarea($p); ?></textarea>
                            <button type="button" class="button cfo-rm">Remove</button>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <button type="button" class="button cfo-add" data-wrap="cfo_with" data-name="costs_with_points[]">+ Add Point</button>
                </td>
            </tr>
        </table>
        <?php submit_button('Save Changes'); ?>
    </form>
    <script>
    jQuery(function($){
        function bindRm(row){ row.find('.cfo-rm').on('click',function(){ row.remove(); }); }
        $('.cfo-pt').each(function(){ bindRm($(this)); });
        $('.cfo-add').on('click',function(){
            var wrap=$(this).data('wrap'), name=$(this).data('name');
            var row=$('<div class="cfo-pt" style="display:flex;gap:8px;margin-bottom:6px"><textarea name="'+name+'" rows="2" class="large-text"></textarea><button type="button" class="button cfo-rm">Remove</button></div>');
            $('#'+wrap).append(row); bindRm(row);
        });
    });
    </script>
    <?php echo '</div>';
}

function cfo_promo_footer_page() {
    $url = admin_url('admin.php?page=promo-footer');
    echo '<div class="wrap"><h1>Footer</h1>'; cfo_promo_notice();
    cfo_promo_form_open('footer', $url);
    cfo_promo_input('Title',             'footer_title');
    cfo_promo_input('Description',       'footer_subtitle', true);
    cfo_promo_input('Button Text',       'footer_button_text');
    cfo_promo_input('Text Under Button', 'footer_button_subtext');
    cfo_promo_input('Copyright Text',    'footer_copyright');
    cfo_promo_input('Bottom Right Text', 'footer_tagline');
    cfo_promo_form_close();
    echo '</div>';
}

// ============================================================================
// REST ENDPOINT
// ============================================================================

add_action('rest_api_init', function () {
    register_rest_route('cfo/v1', '/promo', [
        'methods'             => 'GET',
        'callback'            => 'cfo_get_promo_content',
        'permission_callback' => '__return_true',
    ]);
});

function cfo_get_promo_content() {
    $number_cards = [];
    foreach (get_posts(['post_type'=>'promo_number','posts_per_page'=>-1,'orderby'=>'menu_order','order'=>'ASC','post_status'=>'publish']) as $p) {
        $number_cards[] = ['number'=>get_post_meta($p->ID,'card_number',true),'label'=>get_post_meta($p->ID,'card_label',true),'description'=>get_post_meta($p->ID,'card_description',true)];
    }

    $session_cards = [];
    foreach (get_posts(['post_type'=>'promo_session','posts_per_page'=>-1,'orderby'=>'menu_order','order'=>'ASC','post_status'=>'publish']) as $p) {
        $session_cards[] = ['icon'=>get_post_meta($p->ID,'card_icon_url',true),'title'=>$p->post_title,'description'=>get_post_meta($p->ID,'card_description',true)];
    }

    return rest_ensure_response([
        'hero'    => ['conference_datetime' => cfo_promo_get('conference_datetime'),'banner_text'=>cfo_promo_get('banner_text'),'date'=>cfo_promo_get('date'),'time'=>cfo_promo_get('time'),'badge'=>cfo_promo_get('badge'),'jumbo'=>cfo_promo_get('jumbo'),'subtitle'=>cfo_promo_get('subtitle'),'description'=>cfo_promo_get('description'),'button_text'=>cfo_promo_get('button_text'),'image'=>cfo_promo_get('image'),'image_caption'=>cfo_promo_get('image_caption')],
        'numbers' => ['title'=>cfo_promo_get('numbers_title'),'subtitle'=>cfo_promo_get('numbers_subtitle'),'cards'=>$number_cards],
        'inside'  => ['title'=>cfo_promo_get('inside_title'),'cards'=>$session_cards],
        'carousel'=> ['title'=>cfo_promo_get('carousel_title'),'subtitle'=>cfo_promo_get('carousel_subtitle'),'images'=>json_decode(cfo_promo_get('carousel_images_json','[]'),true)?:[]],
        'costs'   => ['title'=>cfo_promo_get('costs_title'),'subtitle'=>cfo_promo_get('costs_subtitle'),'without_title'=>cfo_promo_get('costs_without_title'),'without_points'=>json_decode(cfo_promo_get('costs_without_points_json','[]'),true)?:[],'with_title'=>cfo_promo_get('costs_with_title'),'with_points'=>json_decode(cfo_promo_get('costs_with_points_json','[]'),true)?:[]],
        'footer'  => ['title'=>cfo_promo_get('footer_title'),'subtitle'=>cfo_promo_get('footer_subtitle'),'button_text'=>cfo_promo_get('footer_button_text'),'button_subtext'=>cfo_promo_get('footer_button_subtext'),'copyright'=>cfo_promo_get('footer_copyright'),'tagline'=>cfo_promo_get('footer_tagline')],
        'modal'   => ['title'=>cfo_promo_get('modal_title'),'subtext'=>cfo_promo_get('modal_subtext')],
    ]);
}

// Registration — Kit Form ID
add_filter('rest_post_dispatch', function($response, $server, $request) {
    if ($request->get_route() === '/cfo/v1/promo') {
        $data = $response->get_data();
        $data['registration'] = ['kit_form_id' => cfo_promo_get('kit_form_id', '')];
        $response->set_data($data);
    }
    return $response;
}, 10, 3);

add_action('admin_menu', function() {
    add_submenu_page('promo-site', 'Registration', 'Registration', 'manage_options', 'cfo-promo-registration', 'cfo_promo_registration_page');
}, 20);

function cfo_promo_registration_page() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cfo_promo_section']) && $_POST['cfo_promo_section'] === 'registration') {
        check_admin_referer('cfo_promo_save_nonce');
        cfo_promo_save('kit_form_id', sanitize_text_field($_POST['kit_form_id'] ?? ''));
        cfo_promo_save('kit_form_uid', sanitize_text_field($_POST['kit_form_uid'] ?? ''));
        cfo_promo_save('modal_title', sanitize_text_field($_POST['modal_title'] ?? ''));
        cfo_promo_save('modal_subtext', sanitize_textarea_field($_POST['modal_subtext'] ?? ''));
        echo '<div class="updated"><p>Saved.</p></div>';
    }
    $val = cfo_promo_get('kit_form_id', '');
    ?>
    <div class="wrap">
        <h1>Registration</h1>
        <form method="post">
            <?php wp_nonce_field('cfo_promo_save_nonce'); ?>
            <input type="hidden" name="cfo_promo_section" value="registration" />
            <input type="hidden" name="_wp_http_referer" value="<?php echo esc_url($_SERVER['REQUEST_URI']); ?>" />
            <table class="form-table">
                <tr>
                    <th><label for="kit_form_id">Kit Form ID</label></th>
                    <td>
                        <input type="text" name="kit_form_id" id="kit_form_id" value="<?php echo esc_attr($val); ?>" class="regular-text" placeholder="e.g. 9434684" />
                        <p class="description">Paste the numeric form ID from app.kit.com</p>
                    </td>
                </tr>
                <tr>
                    <th><label for="kit_form_uid">Kit Form UID</label></th>
                    <td>
                        <input type="text" name="kit_form_uid" id="kit_form_uid" value="<?php echo esc_attr(cfo_promo_get('kit_form_uid', '')); ?>" class="regular-text" placeholder="e.g. c46a26414c" />
                        <p class="description">The data-uid value from the Kit embed script</p>
                    </td>
                </tr>
                <tr><td colspan="2"><hr /><h2 style="margin:4px 0">Modal Content</h2><p class="description">The pop-up shown when visitors click a registration button. The date is taken automatically from the Hero "Conference Date & Time".</p></td></tr>
                <tr>
                    <th><label for="modal_title">Modal Title</label></th>
                    <td>
                        <input type="text" name="modal_title" id="modal_title" value="<?php echo esc_attr(cfo_promo_get('modal_title', '')); ?>" class="regular-text" placeholder="Reserve Your Free Seat" />
                    </td>
                </tr>
                <tr>
                    <th><label for="modal_subtext">Text Under Button</label></th>
                    <td>
                        <textarea name="modal_subtext" id="modal_subtext" rows="3" class="large-text" placeholder="Seats are limited. Once all seats are filled, access cannot be guaranteed..."><?php echo esc_textarea(cfo_promo_get('modal_subtext', '')); ?></textarea>
                    </td>
                </tr>
            </table>
            <p class="submit"><input type="submit" class="button-primary" value="Save Changes" /></p>
        </form>
    </div>
    <?php
}