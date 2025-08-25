<?php
/**
 * Plugin Name: Color Test Plugin
 * Description: 色変更機能のシンプルなテスト用プラグイン
 * Version: 1.0.0
 * Author: Test
 */

// セキュリティ：直接アクセスを防ぐ
if (!defined('ABSPATH')) {
    exit;
}

// プラグインの定数定義
define('COLOR_TEST_VERSION', '1.0.0');
define('COLOR_TEST_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Color Test メインクラス
 */
class ColorTestPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    /**
     * プラグイン初期化
     */
    public function init() {
        // ショートコード登録
        add_shortcode('color_test', array($this, 'render_shortcode'));
    }
    
    /**
     * スクリプトとスタイルの読み込み
     */
    public function enqueue_scripts() {
        // 確実な動作のため、フロントエンドで常時読み込み
        if (!is_admin()) {
            wp_enqueue_script(
                'color-test-js',
                COLOR_TEST_PLUGIN_URL . 'assets/color-test.iife.js',
                array(),
                COLOR_TEST_VERSION,
                true
            );
        }
    }
    
    /**
     * ショートコード処理
     */
    public function render_shortcode($atts) {
        // 一意のIDを生成
        static $instance_counter = 0;
        $instance_counter++;
        $unique_id = 'color-test-' . $instance_counter . '-' . uniqid();
        
        // 設定をJavaScriptに渡す
        $config = array(
            'instanceId' => $unique_id
        );
        
        ob_start();
        ?>
        <div id="<?php echo esc_attr($unique_id); ?>-container" class="color-test-container" style="border: 5px solid red; padding: 20px; margin: 20px 0; background-color: yellow;">
            <h2>🧪 Color Test Plugin が動作中</h2>
            <p><strong>プラグイン読み込み: ✅</strong></p>
            <p><strong>Instance ID: <?php echo esc_html($unique_id); ?></strong></p>
            
            <!-- 緊急テスト用のHTML直接埋め込み -->
            <div style="background-color: white; border: 3px solid black; padding: 15px; margin: 10px 0;">
                <h3>🔴 緊急テスト: HTMLボタン</h3>
                <div id="test-box" style="width: 200px; height: 100px; background-color: white; border: 2px solid #000; margin: 10px 0; display: flex; align-items: center; justify-content: center;">
                    初期状態
                </div>
                <button onclick="document.getElementById('test-box').style.backgroundColor='red'; document.getElementById('test-box').innerText='赤になった！';" style="padding: 10px 20px; background: red; color: white; border: none; margin: 5px;">
                    赤にする（HTML）
                </button>
                <button onclick="document.getElementById('test-box').style.backgroundColor='blue'; document.getElementById('test-box').innerText='青になった！';" style="padding: 10px 20px; background: blue; color: white; border: none; margin: 5px;">
                    青にする（HTML）
                </button>
            </div>
            
            <script type="text/javascript">
                if (!window.COLOR_TEST_INSTANCES) {
                    window.COLOR_TEST_INSTANCES = {};
                }
                window.COLOR_TEST_INSTANCES['<?php echo esc_js($unique_id); ?>'] = <?php echo json_encode($config); ?>;
                
                // デバッグ情報を出力
                console.log('🧪 Color Test: 設定を登録しました', {
                    instanceId: '<?php echo esc_js($unique_id); ?>',
                    config: <?php echo json_encode($config); ?>,
                    timestamp: new Date()
                });
                
                // 即座にテスト実行
                setTimeout(function() {
                    if (typeof ColorTest !== 'undefined') {
                        console.log('✅ ColorTest スクリプト読み込み完了');
                    } else {
                        console.error('❌ ColorTest スクリプトが見つかりません');
                    }
                }, 1000);
            </script>
            <div id="<?php echo esc_attr($unique_id); ?>"></div>
        </div>
        <?php
        return ob_get_clean();
    }
}

// プラグイン初期化
new ColorTestPlugin();
?>