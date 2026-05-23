<?php
/**
 * Plugin Name: Azadi Headless Settings
 * Description: Headless WordPress settings and REST API endpoints for the Azadi Coffee Next.js frontend.
 * Version: 0.1.0
 * Author: Azadi Coffee
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Azadi_Headless_Settings {
    private const REST_NAMESPACE = 'azadi/v1';

    private const OPTIONS = [
        'theme-settings' => 'azadi_theme_settings',
        'landing-settings' => 'azadi_landing_settings',
        'font-settings' => 'azadi_font_settings',
        'design-presets' => 'azadi_design_presets',
        'header-settings' => 'azadi_header_settings',
        'footer-settings' => 'azadi_footer_settings',
        'component-settings' => 'azadi_component_settings',
    ];

    public static function boot(): void {
        add_action('admin_menu', [self::class, 'register_admin_menu']);
        add_action('admin_notices', [self::class, 'admin_notices']);
        add_action('rest_api_init', [self::class, 'register_rest_routes']);
        add_filter('upload_mimes', [self::class, 'allow_font_uploads']);
        add_filter('rest_pre_serve_request', [self::class, 'send_cors_headers'], 10, 4);
    }

    public static function activate(): void {
        foreach (self::OPTIONS as $endpoint => $option_name) {
            if (get_option($option_name, null) === null) {
                add_option($option_name, self::default_value($endpoint), '', false);
            }
        }
    }

    public static function register_admin_menu(): void {
        add_menu_page(
            'Azadi Settings',
            'Azadi Settings',
            'manage_options',
            'azadi-settings',
            [self::class, 'render_admin_page'],
            'dashicons-admin-customizer',
            58
        );

        add_submenu_page(
            'azadi-settings',
            'Setup Wizard',
            'Setup Wizard',
            'manage_options',
            'azadi-setup',
            [self::class, 'render_setup_wizard'],
            0
        );

        $pages = [
            'design-settings' => 'Design Settings',
            'theme-presets' => 'Theme Presets',
            'fonts' => 'Fonts',
            'landing-page' => 'Landing Page',
            'header-footer' => 'Header & Footer',
            'components' => 'Components',
            'api-status' => 'API Status',
        ];

        foreach ($pages as $slug => $title) {
            add_submenu_page(
                'azadi-settings',
                $title,
                $title,
                'manage_options',
                'azadi-' . $slug,
                [self::class, 'render_admin_page']
            );
        }
    }

    public static function render_admin_page(): void {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to manage Azadi settings.', 'azadi-headless-settings'));
        }

        $namespace = esc_html(self::REST_NAMESPACE);
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <p>Azadi headless settings are available to the Next.js frontend through public GET endpoints and admin-only POST endpoints.</p>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th>Setting</th>
                        <th>Option name</th>
                        <th>REST endpoint</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach (self::OPTIONS as $endpoint => $option_name) : ?>
                        <tr>
                            <td><?php echo esc_html($endpoint); ?></td>
                            <td><code><?php echo esc_html($option_name); ?></code></td>
                            <td><code>/wp-json/<?php echo $namespace; ?>/<?php echo esc_html($endpoint); ?></code></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <p>Use authenticated REST requests or a later custom UI to update these option payloads.</p>
        </div>
        <?php
    }

    public static function register_rest_routes(): void {
        foreach (self::OPTIONS as $endpoint => $option_name) {
            register_rest_route(self::REST_NAMESPACE, '/' . $endpoint, [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => static fn(WP_REST_Request $request) => self::get_option_response($endpoint, $option_name, $request),
                    'permission_callback' => '__return_true',
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => static fn(WP_REST_Request $request) => self::update_option_response($endpoint, $option_name, $request),
                    'permission_callback' => [self::class, 'can_update_settings'],
                    'args' => [
                        'payload' => [
                            'required' => false,
                        ],
                    ],
                ],
            ]);
        }

        register_rest_route(self::REST_NAMESPACE, '/font-upload', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [self::class, 'upload_font'],
            'permission_callback' => [self::class, 'can_update_settings'],
        ]);
    }

    public static function can_update_settings(): bool {
        return current_user_can('manage_options');
    }

    public static function send_cors_headers($served, $result, $request, $server) {
        if (!$request instanceof WP_REST_Request) {
            return $served;
        }

        $route = $request->get_route();
        if (strpos($route, '/' . self::REST_NAMESPACE . '/') !== 0) {
            return $served;
        }

        $origin = get_http_origin();
        if (!$origin) {
            return $served;
        }

        $allowed = array_filter(array_map('trim', explode(',', (string) getenv('AZADI_ALLOWED_ORIGINS'))));
        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Vary: Origin', false);
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        }

        return $served;
    }

    public static function get_option_response(string $endpoint, string $option_name, WP_REST_Request $request): WP_REST_Response {
        $value = get_option($option_name, self::default_value($endpoint));
        $locale = sanitize_key((string) $request->get_param('locale'));

        if ($locale && is_array($value) && isset($value[$locale]) && is_array($value[$locale])) {
            $value = $value[$locale];
        }

        return rest_ensure_response($value);
    }

    public static function update_option_response(string $endpoint, string $option_name, WP_REST_Request $request): WP_REST_Response {
        $payload = $request->get_json_params();
        if (!is_array($payload)) {
            return new WP_REST_Response(['message' => 'JSON object payload is required.'], 400);
        }

        $sanitized = self::sanitize_payload_for_endpoint($endpoint, $payload);
        update_option($option_name, $sanitized, false);

        return rest_ensure_response($sanitized);
    }

    private static function sanitize_payload_for_endpoint(string $endpoint, array $payload): array {
        $sanitized = self::sanitize_payload($payload);

        switch ($endpoint) {
            case 'theme-settings':
                return self::sanitize_theme_settings($sanitized);
            case 'font-settings':
                return self::sanitize_font_settings($sanitized);
            case 'design-presets':
                return self::sanitize_design_presets($sanitized);
            case 'landing-settings':
            case 'header-settings':
            case 'footer-settings':
                return self::sanitize_locale_settings($sanitized);
            default:
                return $sanitized;
        }
    }

    private static function sanitize_payload(array $payload): array {
        $sanitized = [];

        foreach ($payload as $key => $value) {
            $safe_key = preg_replace('/[^A-Za-z0-9_\-]/', '', (string) $key);
            if ($safe_key === '') {
                continue;
            }

            if (is_array($value)) {
                $sanitized[$safe_key] = self::sanitize_payload($value);
            } elseif (is_bool($value) || is_int($value) || is_float($value)) {
                $sanitized[$safe_key] = $value;
            } elseif (is_string($value)) {
                $sanitized[$safe_key] = wp_kses_post($value);
            } elseif ($value === null) {
                $sanitized[$safe_key] = null;
            }
        }

        return $sanitized;
    }

    private static function sanitize_theme_settings(array $payload): array {
        $defaults = self::default_value('theme-settings');
        $payload = array_replace_recursive($defaults, $payload);

        foreach (['colors', 'typography', 'shape', 'styles'] as $group) {
            if (!isset($payload[$group]) || !is_array($payload[$group])) {
                $payload[$group] = $defaults[$group];
            }
        }

        foreach ($payload['colors'] as $key => $value) {
            if (!is_string($value) || !preg_match('/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', $value)) {
                $payload['colors'][$key] = $defaults['colors'][$key] ?? '#000000';
            }
        }

        foreach ($payload['shape'] as $key => $value) {
            $number = is_numeric($value) ? (float) $value : (float) ($defaults['shape'][$key] ?? 0);
            $payload['shape'][$key] = max(0, min($number, $key === 'spacingScale' ? 2 : 999));
        }

        $style_enums = [
            'header' => ['minimal', 'bordered', 'floating'],
            'footer' => ['dark', 'light', 'bordered'],
            'landing' => ['stacked', 'gallery', 'editorial'],
            'productCard' => ['bordered', 'soft', 'commercial'],
            'blogCard' => ['line', 'card', 'editorial'],
            'button' => ['square', 'soft', 'pill'],
        ];

        foreach ($style_enums as $key => $allowed) {
            if (!in_array($payload['styles'][$key] ?? '', $allowed, true)) {
                $payload['styles'][$key] = $defaults['styles'][$key];
            }
        }

        $payload['presetId'] = sanitize_key((string) ($payload['presetId'] ?? $defaults['presetId']));
        $payload['typography'] = self::sanitize_font_settings($payload['typography']);

        return $payload;
    }

    private static function sanitize_font_settings(array $payload): array {
        $allowed_formats = ['woff2', 'woff', 'truetype', ''];

        $payload['fontFamily'] = sanitize_text_field((string) ($payload['fontFamily'] ?? '"Vazirmatn", system-ui, sans-serif'));
        $payload['persianFont'] = sanitize_text_field((string) ($payload['persianFont'] ?? 'Vazirmatn'));
        $payload['englishFont'] = sanitize_text_field((string) ($payload['englishFont'] ?? 'Inter'));
        $payload['customFontName'] = sanitize_text_field((string) ($payload['customFontName'] ?? ''));
        $payload['customFontDataUrl'] = esc_url_raw((string) ($payload['customFontDataUrl'] ?? ''));
        $payload['customFontFormat'] = sanitize_key((string) ($payload['customFontFormat'] ?? ''));

        if (!in_array($payload['customFontFormat'], $allowed_formats, true)) {
            $payload['customFontFormat'] = '';
            $payload['customFontDataUrl'] = '';
        }

        $uploaded = [];
        if (isset($payload['uploadedFonts']) && is_array($payload['uploadedFonts'])) {
            foreach ($payload['uploadedFonts'] as $font) {
                if (!is_array($font)) {
                    continue;
                }

                $format = sanitize_key((string) ($font['format'] ?? ''));
                if (!in_array($format, ['woff2', 'woff', 'truetype'], true)) {
                    continue;
                }

                $uploaded[] = [
                    'name' => sanitize_text_field((string) ($font['name'] ?? '')),
                    'url' => esc_url_raw((string) ($font['url'] ?? '')),
                    'format' => $format,
                ];
            }
        }

        $payload['uploadedFonts'] = $uploaded;

        return $payload;
    }

    private static function sanitize_design_presets(array $payload): array {
        $presets = [];

        foreach ($payload as $preset) {
            if (!is_array($preset)) {
                continue;
            }

            $presets[] = [
                'id' => sanitize_key((string) ($preset['id'] ?? '')),
                'name' => sanitize_text_field((string) ($preset['name'] ?? '')),
                'description' => sanitize_textarea_field((string) ($preset['description'] ?? '')),
                'settings' => self::sanitize_theme_settings(is_array($preset['settings'] ?? null) ? $preset['settings'] : []),
            ];
        }

        return $presets;
    }

    private static function sanitize_locale_settings(array $payload): array {
        foreach (['fa', 'en'] as $locale) {
            if (isset($payload[$locale]) && is_array($payload[$locale])) {
                $payload[$locale] = self::sanitize_payload($payload[$locale]);
            }
        }

        return $payload;
    }

    public static function allow_font_uploads(array $mimes): array {
        if (current_user_can('manage_options')) {
            $mimes['woff'] = 'font/woff';
            $mimes['woff2'] = 'font/woff2';
            $mimes['ttf'] = 'font/ttf';
        }

        return $mimes;
    }

    public static function upload_font(WP_REST_Request $request): WP_REST_Response {
        if (empty($_FILES['font'])) {
            return new WP_REST_Response(['message' => 'Missing font file.'], 400);
        }

        $file = $_FILES['font'];
        $allowed_extensions = ['woff', 'woff2', 'ttf'];
        $extension = strtolower(pathinfo((string) $file['name'], PATHINFO_EXTENSION));
        $allowed_mimes = [
            'woff' => ['font/woff', 'application/font-woff', 'application/x-font-woff'],
            'woff2' => ['font/woff2', 'application/font-woff2', 'application/x-font-woff2'],
            'ttf' => ['font/ttf', 'font/sfnt', 'application/x-font-ttf', 'application/octet-stream'],
        ];

        if (!in_array($extension, $allowed_extensions, true)) {
            return new WP_REST_Response(['message' => 'Only .woff, .woff2, and .ttf font files are allowed.'], 400);
        }

        $reported_mime = isset($file['type']) ? sanitize_mime_type((string) $file['type']) : '';
        if ($reported_mime && !in_array($reported_mime, $allowed_mimes[$extension], true)) {
            return new WP_REST_Response(['message' => 'Invalid reported font MIME type.'], 400);
        }

        $check = wp_check_filetype_and_ext((string) $file['tmp_name'], (string) $file['name'], [
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
        ]);

        if (empty($check['ext']) || empty($check['type']) || !in_array($check['type'], $allowed_mimes[$extension], true)) {
            return new WP_REST_Response(['message' => 'Invalid font file type.'], 400);
        }

        require_once ABSPATH . 'wp-admin/includes/file.php';
        $uploaded = wp_handle_upload($file, [
            'test_form' => false,
            'mimes' => [
                'woff' => 'font/woff',
                'woff2' => 'font/woff2',
                'ttf' => 'font/ttf',
            ],
        ]);

        if (!empty($uploaded['error'])) {
            return new WP_REST_Response(['message' => sanitize_text_field($uploaded['error'])], 400);
        }

        return rest_ensure_response([
            'name' => sanitize_file_name((string) $file['name']),
            'url' => esc_url_raw((string) $uploaded['url']),
            'format' => $extension === 'ttf' ? 'truetype' : $extension,
        ]);
    }

    public static function render_setup_wizard(): void {
        if (!current_user_can('manage_options')) {
            wp_die(esc_html__('You do not have permission to manage Azadi settings.', 'azadi-headless-settings'));
        }

        $saved = get_option('azadi_setup_complete', false);
        $frontend_url = get_option('azadi_frontend_url', '');
        $site_url = get_option('siteurl', '');
        $home_url = get_option('home', '');
        $default_lang = get_option('azadi_default_language', 'fa');

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['azadi_setup_submit'])) {
            check_admin_referer('azadi_setup_wizard');
            self::handle_setup_wizard_submit();
            return;
        }

        $parsed_site = parse_url($site_url ?: 'https://example.com');
        $current_domain = $parsed_site['host'] ?? '';
        ?>
        <div class="wrap" style="max-width:720px">
            <h1><?php esc_html_e('Azadi Coffee — Setup Wizard', 'azadi-headless-settings'); ?></h1>

            <?php if ($saved) : ?>
                <div class="notice notice-success inline">
                    <p><strong><?php esc_html_e('Setup is complete.', 'azadi-headless-settings'); ?></strong></p>
                    <p><?php esc_html_e('You can run this wizard again to update the domain or frontend URL.', 'azadi-headless-settings'); ?></p>
                </div>
            <?php endif; ?>

            <form method="post">
                <?php wp_nonce_field('azadi_setup_wizard'); ?>

                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row">
                            <label for="azadi_domain"><?php esc_html_e('Live Domain', 'azadi-headless-settings'); ?></label>
                        </th>
                        <td>
                            <input
                                id="azadi_domain"
                                name="azadi_domain"
                                type="text"
                                class="regular-text"
                                value="<?php echo esc_attr($current_domain); ?>"
                                placeholder="azadicoffee.com"
                                required
                            />
                            <p class="description">
                                <?php esc_html_e('The public domain where the site will be accessible (e.g. azadicoffee.com). Do not include http:// or https://.', 'azadi-headless-settings'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="azadi_frontend_url"><?php esc_html_e('Frontend URL', 'azadi-headless-settings'); ?></label>
                        </th>
                        <td>
                            <input
                                id="azadi_frontend_url"
                                name="azadi_frontend_url"
                                type="url"
                                class="regular-text"
                                value="<?php echo esc_attr($frontend_url ?: 'https://' . $current_domain); ?>"
                                placeholder="https://azadicoffee.com"
                            />
                            <p class="description">
                                <?php esc_html_e('The public URL of the Next.js frontend. Usually https://&lt;domain&gt;.', 'azadi-headless-settings'); ?>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="azadi_default_language"><?php esc_html_e('Default Language', 'azadi-headless-settings'); ?></label>
                        </th>
                        <td>
                            <select id="azadi_default_language" name="azadi_default_language">
                                <option value="fa" <?php selected($default_lang, 'fa'); ?>><?php esc_html_e('Persian (FA)', 'azadi-headless-settings'); ?></option>
                                <option value="en" <?php selected($default_lang, 'en'); ?>><?php esc_html_e('English (EN)', 'azadi-headless-settings'); ?></option>
                            </select>
                            <p class="description">
                                <?php esc_html_e('The default language for the storefront. Persian is recommended.', 'azadi-headless-settings'); ?>
                            </p>
                        </td>
                    </tr>
                </table>

                <p class="submit">
                    <button type="submit" name="azadi_setup_submit" class="button button-primary button-large">
                        <?php echo $saved ? esc_html__('Update Configuration', 'azadi-headless-settings') : esc_html__('Complete Setup', 'azadi-headless-settings'); ?>
                    </button>
                </p>
            </form>

            <hr />

            <h2><?php esc_html_e('Current Configuration', 'azadi-headless-settings'); ?></h2>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Setting', 'azadi-headless-settings'); ?></th>
                        <th><?php esc_html_e('Value', 'azadi-headless-settings'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><?php esc_html_e('WordPress Site URL (siteurl)', 'azadi-headless-settings'); ?></td>
                        <td><code><?php echo esc_html($site_url ?: '—'); ?></code></td>
                    </tr>
                    <tr>
                        <td><?php esc_html_e('WordPress Home (home)', 'azadi-headless-settings'); ?></td>
                        <td><code><?php echo esc_html($home_url ?: '—'); ?></code></td>
                    </tr>
                    <tr>
                        <td><?php esc_html_e('Frontend URL', 'azadi-headless-settings'); ?></td>
                        <td><code><?php echo esc_html($frontend_url ?: '—'); ?></code></td>
                    </tr>
                    <tr>
                        <td><?php esc_html_e('Default Language', 'azadi-headless-settings'); ?></td>
                        <td><code><?php echo esc_html(strtoupper($default_lang)); ?></code></td>
                    </tr>
                    <tr>
                        <td><?php esc_html_e('Setup Complete', 'azadi-headless-settings'); ?></td>
                        <td><?php echo $saved ? '<span style="color:#0a0">✓ Yes</span>' : '<span style="color:#a00">— Not yet</span>'; ?></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <?php
    }

    private static function handle_setup_wizard_submit(): void {
        $domain = isset($_POST['azadi_domain'])
            ? strtolower(trim(sanitize_text_field(wp_unslash($_POST['azadi_domain']))))
            : '';
        $frontend_url = isset($_POST['azadi_frontend_url'])
            ? esc_url_raw(trim(wp_unslash($_POST['azadi_frontend_url'])))
            : '';
        $default_lang = isset($_POST['azadi_default_language']) && $_POST['azadi_default_language'] === 'en' ? 'en' : 'fa';

        if (empty($domain)) {
            wp_die(esc_html__('Domain is required.', 'azadi-headless-settings'));
        }

        $domain = preg_replace('#^https?://#', '', $domain);
        $domain = rtrim($domain, '/');

        if (empty($frontend_url)) {
            $frontend_url = 'https://' . $domain;
        }

        $site_url = 'https://' . $domain . '/wp';

        // Update WordPress core settings
        update_option('siteurl', $site_url);
        update_option('home', $frontend_url);

        // Store frontend URL for the theme and REST API
        update_option('azadi_frontend_url', $frontend_url);
        update_option('azadi_default_language', $default_lang);
        update_option('azadi_setup_complete', true);

        // Update landing settings with locale-aware defaults
        $landing = get_option('azadi_landing_settings', []);
        if (!is_array($landing)) {
            $landing = [];
        }
        $landing['fa'] = $landing['fa'] ?? [];
        $landing['en'] = $landing['en'] ?? [];

        if (empty($landing['fa']['heroText'])) {
            $landing['fa']['heroText'] = 'فروشگاه فارسی و راست چین برای قهوه تازه برشته، با ریتمی شبیه صفحات کنار هم: آرام، دقیق و محصول محور.';
        }
        if (empty($landing['en']['heroText'])) {
            $landing['en']['heroText'] = 'A precise specialty coffee shop for fresh roasts, with a calm side-by-side page rhythm and product-first navigation.';
        }
        update_option('azadi_landing_settings', $landing);

        // Update header settings with locale-aware branding
        $header = get_option('azadi_header_settings', []);
        if (!is_array($header)) {
            $header = [];
        }
        $header['fa'] = $header['fa'] ?? [];
        $header['en'] = $header['en'] ?? [];
        $header['fa']['brand'] = 'قهوه آزادی';
        $header['en']['brand'] = 'Azadi Coffee';
        update_option('azadi_header_settings', $header);

        // Redirect back with a success notice
        $location = add_query_arg([
            'page' => 'azadi-setup',
            'setup' => 'done',
        ], admin_url('admin.php'));

        wp_safe_redirect($location);
        exit;
    }

    public static function admin_notices(): void {
        if (!current_user_can('manage_options')) {
            return;
        }

        $screen = get_current_screen();
        if (!$screen || strpos($screen->id, 'azadi-') === false) {
            return;
        }

        $setup_done = get_option('azadi_setup_complete', false);
        if (!$setup_done) {
            printf(
                '<div class="notice notice-warning is-dismissible"><p><strong>%s</strong> %s <a href="%s">%s</a></p></div>',
                esc_html__('Azadi Coffee setup is not complete.', 'azadi-headless-settings'),
                esc_html__('Configure the domain and frontend URL in the', 'azadi-headless-settings'),
                esc_url(admin_url('admin.php?page=azadi-setup')),
                esc_html__('Setup Wizard', 'azadi-headless-settings')
            );
        }

        if (isset($_GET['setup']) && $_GET['setup'] === 'done') {
            printf(
                '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                esc_html__('✅ Azadi Coffee setup completed successfully.', 'azadi-headless-settings')
            );
        }
    }

    private static function default_value(string $endpoint): array {
        $theme_settings = [
            'presetId' => 'minimal-light',
            'colors' => [
                'ink' => '#000000',
                'paper' => '#ffffff',
                'warmPaper' => '#f7f5f1',
                'graphite' => '#1f1f1f',
                'stone' => '#8a8178',
                'coffee' => '#6f4e37',
                'line' => '#000000',
                'success' => '#0f7a3b',
                'danger' => '#b42318',
                'tabBackground' => '#ffffff',
                'tabText' => '#000000',
                'tabHoverBackground' => '#f7f5f1',
                'tabHoverText' => '#000000',
                'buttonPrimaryBackground' => '#000000',
                'buttonPrimaryText' => '#ffffff',
                'buttonSecondaryBackground' => '#ffffff',
                'buttonSecondaryText' => '#000000',
            ],
            'typography' => [
                'fontFamily' => '"Vazirmatn", "IRANSansX", "Inter", system-ui, sans-serif',
                'customFontName' => '',
                'customFontDataUrl' => '',
                'customFontFormat' => '',
            ],
            'shape' => [
                'radius' => 0,
                'cardRadius' => 0,
                'buttonRadius' => 0,
                'tabRadius' => 0,
                'shadowIntensity' => 0,
                'spacingScale' => 1,
            ],
            'styles' => [
                'header' => 'bordered',
                'footer' => 'dark',
                'landing' => 'stacked',
                'productCard' => 'bordered',
                'blogCard' => 'line',
                'button' => 'square',
            ],
            'landingTabs' => [
                'backgroundMode' => 'all-white',
                'backgroundColor' => '#ffffff',
                'textColor' => '#111111',
                'borderColor' => '#e5e5e5',
                'hoverBackgroundColor' => '#f5f5f5',
            ],
        ];

        $defaults = [
            'theme-settings' => $theme_settings,
            'landing-settings' => [
                'fa' => [],
                'en' => [],
            ],
            'font-settings' => $theme_settings['typography'],
            'design-presets' => [],
            'header-settings' => [
                'fa' => ['brand' => 'قهوه آزادی', 'navigation' => []],
                'en' => ['brand' => 'Azadi Coffee', 'navigation' => []],
            ],
            'footer-settings' => [
                'fa' => ['brand' => 'Azadi Coffee', 'navigation' => []],
                'en' => ['brand' => 'Azadi Coffee', 'navigation' => []],
            ],
            'component-settings' => [],
        ];

        return $defaults[$endpoint] ?? [];
    }
}

Azadi_Headless_Settings::boot();
register_activation_hook(__FILE__, ['Azadi_Headless_Settings', 'activate']);
