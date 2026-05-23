<?php
/**
 * Headless backend landing page.
 */

if (!defined('ABSPATH')) {
    exit;
}

$frontend_url = azadi_headless_frontend_url();
$admin_url = admin_url();
$rest_url = rest_url();
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<main class="azadi-shell">
    <aside class="azadi-tab" aria-hidden="true">CMS</aside>
    <section class="azadi-main" aria-labelledby="azadi-title">
        <p class="azadi-kicker"><?php esc_html_e('Azadi Coffee backend', 'azadi-headless'); ?></p>
        <h1 id="azadi-title" class="azadi-title"><?php esc_html_e('WordPress is running headless.', 'azadi-headless'); ?></h1>
        <p class="azadi-copy">
            <?php esc_html_e('This WordPress site manages content, products, media, and design settings. The public Azadi Coffee experience is served by the Next.js frontend.', 'azadi-headless'); ?>
        </p>
        <nav class="azadi-actions" aria-label="<?php esc_attr_e('Azadi backend links', 'azadi-headless'); ?>">
            <a class="azadi-button" href="<?php echo esc_url($frontend_url); ?>">
                <?php esc_html_e('Open Next.js frontend', 'azadi-headless'); ?>
            </a>
            <a class="azadi-button secondary" href="<?php echo esc_url($admin_url); ?>">
                <?php esc_html_e('Open WordPress admin', 'azadi-headless'); ?>
            </a>
            <a class="azadi-button secondary" href="<?php echo esc_url($rest_url); ?>">
                <?php esc_html_e('View REST API', 'azadi-headless'); ?>
            </a>
        </nav>
        <div class="azadi-panel" aria-label="<?php esc_attr_e('Headless architecture status', 'azadi-headless'); ?>">
            <div class="azadi-panel-item">
                <strong><?php esc_html_e('Frontend', 'azadi-headless'); ?></strong>
                <span><?php echo esc_html($frontend_url); ?></span>
            </div>
            <div class="azadi-panel-item">
                <strong><?php esc_html_e('CMS', 'azadi-headless'); ?></strong>
                <span><?php esc_html_e('Pages, posts, media, WooCommerce products, and Azadi design settings.', 'azadi-headless'); ?></span>
            </div>
            <div class="azadi-panel-item">
                <strong><?php esc_html_e('API', 'azadi-headless'); ?></strong>
                <span><?php echo esc_html(rest_url('azadi/v1/theme-settings')); ?></span>
            </div>
        </div>
    </section>
    <aside class="azadi-tab" aria-hidden="true">API</aside>
</main>
<?php wp_footer(); ?>
</body>
</html>
