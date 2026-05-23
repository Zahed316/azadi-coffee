<?php
/**
 * Azadi Headless bridge theme functions.
 *
 * This theme intentionally does not recreate the Next.js storefront inside
 * WordPress. It keeps WordPress lightweight as CMS/admin/API while providing
 * a branded backend landing page and an optional public redirect.
 */

if (!defined('ABSPATH')) {
    exit;
}

function azadi_headless_frontend_url(): string
{
    $url = get_option('azadi_frontend_url', '');
    if (!$url) {
        $url = getenv('NEXT_PUBLIC_SITE_URL') ?: getenv('AZADI_FRONTEND_URL') ?: '';
    }
    if (!$url) {
        $url = 'http://localhost:3000';
    }

    return esc_url_raw($url);
}

function azadi_headless_should_redirect(): bool
{
    $value = getenv('AZADI_HEADLESS_REDIRECT') ?: 'false';
    return filter_var($value, FILTER_VALIDATE_BOOLEAN);
}

add_action('after_setup_theme', static function (): void {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script']);
});

add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_style('azadi-headless', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));
});

add_action('template_redirect', static function (): void {
    if (!azadi_headless_should_redirect()) {
        return;
    }

    if (is_admin() || wp_doing_ajax() || wp_is_json_request() || is_feed() || is_robots() || is_favicon()) {
        return;
    }

    $target = azadi_headless_frontend_url();
    if ($target) {
        wp_safe_redirect($target, 302);
        exit;
    }
});

/**
 * Register bilingual post meta fields in the REST API for blog posts.
 */
add_action('init', static function (): void {
    $bilingual_keys = [
        'title_fa', 'title_en',
        'excerpt_fa', 'excerpt_en',
        'category_fa', 'category_en',
        'body_fa', 'body_en',
    ];
    foreach ($bilingual_keys as $key) {
        register_post_meta('post', $key, [
            'show_in_rest' => true,
            'single'       => true,
            'type'         => 'string',
            'auth_callback' => fn() => current_user_can('edit_posts'),
        ]);
    }
});

add_action('admin_notices', static function (): void {
    if (!current_user_can('manage_options')) {
        return;
    }

    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->base !== 'dashboard') {
        return;
    }

    $frontend_url = azadi_headless_frontend_url();
    ?>
    <div class="notice notice-info">
        <p>
            <strong><?php esc_html_e('Azadi Headless is active.', 'azadi-headless'); ?></strong>
            <?php esc_html_e('WordPress is the CMS and API backend. The customer-facing storefront is rendered by Next.js.', 'azadi-headless'); ?>
            <a href="<?php echo esc_url($frontend_url); ?>" target="_blank" rel="noopener noreferrer">
                <?php esc_html_e('Open frontend', 'azadi-headless'); ?>
            </a>
        </p>
    </div>
    <?php
});
