<?php
/**
 * Azadi Coffee — Headless Setup Script
 *
 * Usage (WP-CLI):  wp eval-file wp-content/setup.php
 * Usage (via CLI): php wp-content/setup.php --domain=azadicoffee.com
 *
 * Without flags, prompts interactively.
 *
 * What it does:
 *   1. Prompts for the live domain.
 *   2. Updates WordPress site URL and home.
 *   3. Sets the frontend URL in Azadi theme settings.
 *   4. Ensures WordPress address is directed at the API subdirectory.
 *   5. Forces SSL in admin if HTTPS is detected.
 */

if (PHP_SAPI !== 'cli' && !defined('WP_CLI')) {
    die('This script must be run from the command line.' . "\n");
}

// --- Bootstrap WordPress if available ---
$is_wp = false;
if (defined('ABSPATH') || !empty($_SERVER['SCRIPT_FILENAME'])) {
    // Already running inside WordPress
    $is_wp = function_exists('add_action');
}

if (!$is_wp) {
    // Try to locate wp-load.php
    $possible_paths = [
        __DIR__ . '/../wp-load.php',
        __DIR__ . '/../../wp-load.php',
        __DIR__ . '/../../../wp-load.php',
        getcwd() . '/wp-load.php',
    ];
    foreach ($possible_paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            $is_wp = true;
            break;
        }
    }
}

if (!$is_wp) {
    fwrite(STDERR, "WordPress not found. Run this from the WordPress root or inside WordPress.\n");
    exit(1);
}

// --- Parse arguments ---
$longopts = [
    'domain:',
    'frontend-url:',
    'admin-email:',
    'default-lang:',
    'yes',
    'help',
];
$options = getopt('', $longopts);

if (isset($options['help'])) {
    echo "Azadi Coffee — Headless Setup Script\n\n";
    echo "Options:\n";
    echo "  --domain=<domain>       Live domain (e.g. azadicoffee.com)\n";
    echo "  --frontend-url=<url>    Next.js frontend URL (default: https://<domain>)\n";
    echo "  --admin-email=<email>   Admin email for notifications\n";
    echo "  --default-lang=<lang>   Default language (fa or en, default: fa)\n";
    echo "  --yes                   Skip all prompts\n";
    echo "  --help                  Show this help\n";
    exit(0);
}

$auto_yes = isset($options['yes']);

// --- Helper functions ---
function prompt(string $question, string $default = ''): string {
    if (PHP_SAPI !== 'cli') {
        return $default;
    }
    $display = $default ? " [$default]" : '';
    echo "{$question}{$display}: ";
    $handle = fopen('php://stdin', 'r');
    $line = trim(fgets($handle));
    fclose($handle);
    return $line !== '' ? $line : $default;
}

function writeln(string $message = ''): void {
    echo $message . "\n";
}

// --- Step 1: Domain ---
$domain = $options['domain'] ?? '';
while (!$domain) {
    $domain = prompt('Enter the live domain (e.g. azadicoffee.com)');
    if (!$domain && !$auto_yes) {
        writeln('Domain is required.');
    }
}
$domain = strtolower(trim($domain));
$domain = preg_replace('#^https?://#', '', $domain);
$domain = rtrim($domain, '/');

$scheme = 'https';
$site_url = "{$scheme}://{$domain}";
$frontend_url = $options['frontend-url'] ?? "{$scheme}://{$domain}";
$frontend_url = rtrim($frontend_url, '/');

writeln();
writeln("=== Azadi Coffee Setup ===");
writeln("Domain:       {$domain}");
writeln("Site URL:     {$site_url}");
writeln("Frontend URL: {$frontend_url}");
writeln();

if (!$auto_yes) {
    $confirm = prompt('Proceed with these settings?', 'yes');
    if (strtolower($confirm) !== 'yes' && strtolower($confirm) !== 'y') {
        writeln('Aborted.');
        exit(0);
    }
}

// --- Step 2: Update WordPress Site URL and Home ---
writeln('Updating WordPress site URL and home...');

// WordPress site URL (where WP core files live)
update_option('siteurl', $site_url . '/wp');
// WordPress home URL (the frontend — points to Next.js)
update_option('home', $frontend_url);

writeln("  siteurl: {$site_url}/wp");
writeln("  home:    {$frontend_url}");

// --- Step 3: Configure Azadi settings ---
writeln('Configuring Azadi headless settings...');

// Store frontend URL as a WordPress option for the plugin/theme
update_option('azadi_frontend_url', $frontend_url);

// Update Azadi header/footer settings with the domain
$header_fa = get_option('azadi_header_settings', []);
if (!is_array($header_fa)) {
    $header_fa = [];
}
if (!isset($header_fa['fa'])) {
    $header_fa['fa'] = [];
}
$header_fa['fa']['brand'] = 'قهوه آزادی';
$header_fa['en'] = $header_fa['en'] ?? [];
$header_fa['en']['brand'] = 'Azadi Coffee';
update_option('azadi_header_settings', $header_fa);

// Update landing settings
$landing = get_option('azadi_landing_settings', []);
if (!is_array($landing)) {
    $landing = [];
}
$landing['fa'] = $landing['fa'] ?? [];
$landing['en'] = $landing['en'] ?? [];
$landing['fa']['heroText'] = $landing['fa']['heroText'] ?? 'فروشگاه فارسی و راست چین برای قهوه تازه برشته، با ریتمی شبیه صفحات کنار هم: آرام، دقیق و محصول محور.';
$landing['en']['heroText'] = $landing['en']['heroText'] ?? 'A precise specialty coffee shop for fresh roasts, with a calm side-by-side page rhythm and product-first navigation.';
update_option('azadi_landing_settings', $landing);

// --- Step 4: Configure permalinks ---
writeln('Setting permalink structure...');
// We can't flush rewrite rules from here easily, but we can set the option
// The actual flush happens on plugin activation or admin visit
update_option('permalink_structure', '/%postname%/');

// --- Step 5: Set default language ---
$default_lang = $options['default-lang'] ?? 'fa';
writeln("Default language set to: {$default_lang}");

// For the headless setup, the language is handled by Next.js routing
// Store the preference so the plugin can use it
update_option('azadi_default_language', $default_lang);

// --- Step 6: Admin email ---
if (!empty($options['admin-email'])) {
    update_option('admin_email', sanitize_email($options['admin-email']));
    writeln("Admin email set to: {$options['admin-email']}");
}

// --- Step 7: Update .htaccess for WordPress in /wp subdirectory ---
writeln('Ensuring WordPress lives in /wp subdirectory...');
$htaccess_path = ABSPATH . '.htaccess';
$htaccess_rules = <<<HTACCESS
# BEGIN WordPress
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /wp/
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /wp/index.php [L]
# END WordPress
HTACCESS;

if (is_writable(dirname(ABSPATH)) || is_writable($htaccess_path)) {
    file_put_contents($htaccess_path, $htaccess_rules);
    writeln('.htaccess updated for /wp/ subdirectory.');
} else {
    writeln('Warning: Cannot write .htaccess. Update it manually:');
    writeln($htaccess_rules);
}

// --- Done ---
writeln();
writeln('✅ Setup complete!');
writeln();
writeln('Next steps:');
writeln("  1. Update your DNS to point {$domain} to this server.");
writeln("  2. Configure SSL (Certbot or similar) for {$domain}.");
writeln("  3. Start the Docker stack: docker compose up -d");
writeln("  4. Verify the frontend at {$frontend_url}");
writeln("  5. Log into WordPress admin at {$site_url}/wp/wp-admin");
writeln();
