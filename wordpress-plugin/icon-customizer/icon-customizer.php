<?php
/**
 * Plugin Name: Icon Customizer
 * Plugin URI: https://github.com/1ssei112266/icon-editor
 * Description: WordPress埋め込み可能なアイコンカスタマイザー。ショートコード [icon_customizer] で表示できます。
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: icon-customizer
 */

// セキュリティ：直接アクセスを防ぐ
if (!defined('ABSPATH')) {
    exit;
}

// プラグインの定数定義
define('ICON_CUSTOMIZER_VERSION', '1.0.0');
define('ICON_CUSTOMIZER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ICON_CUSTOMIZER_PLUGIN_PATH', plugin_dir_path(__FILE__));

/**
 * Icon Customizer メインクラス
 */
class IconCustomizer {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * プラグイン初期化
     */
    public function init() {
        // ショートコード登録
        add_shortcode('icon_customizer', array($this, 'render_shortcode'));
    }
    
    /**
     * スクリプトとスタイルの読み込み
     */
    public function enqueue_scripts() {
        // ショートコードが使用されているページでのみ読み込み
        global $post;
        if (is_object($post) && has_shortcode($post->post_content, 'icon_customizer')) {
            wp_enqueue_style(
                'icon-customizer-css',
                ICON_CUSTOMIZER_PLUGIN_URL . 'assets/index.css',
                array(),
                ICON_CUSTOMIZER_VERSION
            );
            
            wp_enqueue_script(
                'icon-customizer-js',
                ICON_CUSTOMIZER_PLUGIN_URL . 'assets/index.js',
                array(),
                ICON_CUSTOMIZER_VERSION,
                true
            );
        }
    }
    
    /**
     * ショートコード処理
     */
    public function render_shortcode($atts) {
        // デフォルト属性
        $attributes = shortcode_atts(array(
            'image' => ICON_CUSTOMIZER_PLUGIN_URL . 'assets/dummy-icon.png',
            'width' => '100%',
            'height' => 'auto'
        ), $atts);
        
        // 設定をJavaScriptに渡す
        $config = array(
            'baseImageUrl' => esc_url($attributes['image']),
            'pluginUrl' => ICON_CUSTOMIZER_PLUGIN_URL
        );
        
        ob_start();
        ?>
        <div id="icon-customizer-container" style="width: <?php echo esc_attr($attributes['width']); ?>; height: <?php echo esc_attr($attributes['height']); ?>;">
            <script type="text/javascript">
                window.ICON_EDITOR_CONFIG = <?php echo json_encode($config); ?>;
            </script>
            <div id="root"></div>
        </div>
        <?php
        return ob_get_clean();
    }
    
    /**
     * プラグイン有効化時の処理
     */
    public function activate() {
        // 必要に応じて初期設定を追加
        flush_rewrite_rules();
    }
    
    /**
     * プラグイン無効化時の処理
     */
    public function deactivate() {
        flush_rewrite_rules();
    }
}

// プラグイン初期化
new IconCustomizer();