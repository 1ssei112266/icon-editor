<?php
/**
 * Plugin Name: Icon Customizer
 * Plugin URI: https://github.com/1ssei112266/icon-editor
 * Description: WordPress埋め込み可能なアイコンカスタマイザー。ショートコード [icon_customizer] で表示できます。
 * Version: 1.0.0
 * Author: IsseiSuzuki
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
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * プラグイン初期化
     */
    public function init() {
        // ショートコード登録
        add_shortcode('icon_customizer', array($this, 'render_shortcode'));
        
        // ブロックエディター用ショートコードプレビュー
        add_filter('render_block', array($this, 'render_shortcode_preview'), 10, 2);
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
     * ブロックエディター用アセットの読み込み
     */
    public function enqueue_editor_assets() {
        wp_enqueue_script(
            'icon-customizer-editor',
            ICON_CUSTOMIZER_PLUGIN_URL . 'assets/editor.js',
            array('wp-blocks', 'wp-element', 'wp-editor'),
            ICON_CUSTOMIZER_VERSION,
            true
        );
        
        wp_enqueue_style(
            'icon-customizer-editor-css',
            ICON_CUSTOMIZER_PLUGIN_URL . 'assets/editor.css',
            array(),
            ICON_CUSTOMIZER_VERSION
        );
    }
    
    /**
     * ショートコードプレビュー（ブロックエディター用）
     */
    public function render_shortcode_preview($block_content, $block) {
        if (isset($block['blockName']) && $block['blockName'] === 'core/shortcode') {
            if (strpos($block_content, '[icon_customizer') !== false) {
                return '<div class="icon-customizer-preview">
                    <div style="border: 2px dashed #ccc; padding: 20px; text-align: center; background: #f9f9f9;">
                        <span style="color: #666;">📱 Icon Customizer</span><br>
                        <small style="color: #999;">フロントエンドで表示されます</small>
                    </div>
                </div>' . $block_content;
            }
        }
        return $block_content;
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