<?php
/**
 * Plugin Name: Icon Customizer
 * Plugin URI: https://github.com/1ssei112266/icon-editor
 * Description: WordPress埋め込み可能なアイコンカスタマイザー。ショートコード [icon_customizer] で表示できます。
 * Version: 1.0.24
 * Author: IsseiSuzuki
 * License: GPL v2 or later
 * Text Domain: icon-customizer
 */

// セキュリティ：直接アクセスを防ぐ
if (!defined('ABSPATH')) {
    exit;
}

// プラグインの定数定義
define('ICON_CUSTOMIZER_VERSION', '1.0.24');
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
        // HTML+JS版では外部スクリプト不要
        // CSSのみ読み込み
        if (!is_admin()) {
            wp_enqueue_style(
                'icon-customizer-css',
                ICON_CUSTOMIZER_PLUGIN_URL . 'assets/index.css',
                array(),
                ICON_CUSTOMIZER_VERSION
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
        $unique_id = 'icon-customizer-' . $instance_counter . '-' . uniqid();
        
        // デフォルト属性
        $attributes = shortcode_atts(array(
            'image' => ICON_CUSTOMIZER_PLUGIN_URL . 'assets/dummy-icon.png',
            'width' => '100%',
            'height' => 'auto'
        ), $atts);
        
        ob_start();
        ?>
        <div id="<?php echo esc_attr($unique_id); ?>-container" class="icon-customizer-container" style="width: <?php echo esc_attr($attributes['width']); ?>; height: <?php echo esc_attr($attributes['height']); ?>;">
            
            <!-- 初期表示: アイコンプレビューとボタン -->
            <div id="<?php echo esc_attr($unique_id); ?>-initial" style="text-align: center; padding: 20px;">
                <div style="width: 200px; height: 200px; margin: 0 auto 20px; background: transparent; display: flex; align-items: center; justify-content: center; border-radius: 16px;">
                    <img src="<?php echo esc_url($attributes['image']); ?>" alt="アイコン" style="max-width: 180px; max-height: 180px; object-fit: cover;" />
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="downloadOriginal('<?php echo esc_js($attributes['image']); ?>')" style="padding: 12px 24px; background: #f8bbd9; color: white; border: none; border-radius: 20px; font-weight: 600; cursor: pointer;">
                        ダウンロード
                    </button>
                    <button onclick="showCustomizer('<?php echo esc_js($unique_id); ?>')" style="padding: 12px 24px; background: #f8bbd9; color: white; border: none; border-radius: 20px; font-weight: 600; cursor: pointer;">
                        自分好みに編集
                    </button>
                </div>
            </div>

            <!-- カスタマイズ画面（初期は非表示） -->
            <div id="<?php echo esc_attr($unique_id); ?>-customize" style="display: none; padding: 20px;">
                <div style="display: flex; gap: 30px; align-items: flex-start; justify-content: center; flex-wrap: wrap;">
                    
                    <!-- プレビューエリア -->
                    <div style="text-align: center;">
                        <h3 style="margin-bottom: 20px;">プレビュー</h3>
                        <div id="<?php echo esc_attr($unique_id); ?>-preview" style="width: 200px; height: 200px; background: #ffffff; border: 3px solid white; border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                            <img src="<?php echo esc_url($attributes['image']); ?>" alt="アイコン" style="width: 120px; height: 120px; object-fit: cover;" />
                        </div>
                        <button onclick="downloadCustomized('<?php echo esc_js($unique_id); ?>')" style="padding: 10px 20px; background: #4ade80; color: white; border: none; border-radius: 8px; cursor: pointer;">
                            ダウンロード
                        </button>
                    </div>

                    <!-- カスタマイズパネル -->
                    <div style="background: #fef3c7; border: 2px solid #fde68a; border-radius: 16px; padding: 20px; min-width: 250px;">
                        <h3 style="margin-bottom: 20px; text-align: center;">カスタマイズ</h3>
                        
                        <!-- 形状選択 -->
                        <div style="margin-bottom: 20px;">
                            <p style="font-weight: 600; margin-bottom: 10px; text-align: center;">形状</p>
                            <div style="display: flex; gap: 10px; justify-content: center;">
                                <button onclick="changeShape('<?php echo esc_js($unique_id); ?>', 'circle')" style="padding: 8px 16px; background: #f8bbd9; color: white; border: none; border-radius: 8px; cursor: pointer;">
                                    円形
                                </button>
                                <button onclick="changeShape('<?php echo esc_js($unique_id); ?>', 'square')" style="padding: 8px 16px; background: #f8bbd9; color: white; border: none; border-radius: 8px; cursor: pointer;">
                                    四角形
                                </button>
                            </div>
                        </div>

                        <!-- サイズ調整 -->
                        <div style="margin-bottom: 20px;">
                            <p style="font-weight: 600; margin-bottom: 10px; text-align: center;">サイズ</p>
                            <div style="display: flex; gap: 10px; justify-content: center; align-items: center;">
                                <button onclick="changeSize('<?php echo esc_js($unique_id); ?>', -10)" style="padding: 8px 16px; background: #f8bbd9; color: white; border: none; border-radius: 8px; cursor: pointer;">
                                    小さく
                                </button>
                                <span id="<?php echo esc_attr($unique_id); ?>-size">120%</span>
                                <button onclick="changeSize('<?php echo esc_js($unique_id); ?>', 10)" style="padding: 8px 16px; background: #f8bbd9; color: white; border: none; border-radius: 8px; cursor: pointer;">
                                    大きく
                                </button>
                            </div>
                        </div>

                        <!-- 背景色 -->
                        <div style="margin-bottom: 20px;">
                            <p style="font-weight: 600; margin-bottom: 10px; text-align: center;">背景色</p>
                            <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px;">
                                <!-- ローカル版と同じ9色プリセット -->
                                <button onclick="changeColor('<?php echo esc_js($unique_id); ?>', '#a8dadc')" style="width: 28px; height: 28px; background: #a8dadc; border: 2px solid #ccc; border-radius: 50%; cursor: pointer;" title="ライトブルー"></button>
                                <button onclick="changeColor('<?php echo esc_js($unique_id); ?>', '#f1c0e8')" style="width: 28px; height: 28px; background: #f1c0e8; border: 2px solid #ccc; border-radius: 50%; cursor: pointer;" title="ピンク"></button>
                                <button onclick="changeColor('<?php echo esc_js($unique_id); ?>', '#ffeb3b')" style="width: 28px; height: 28px; background: #ffeb3b; border: 2px solid #ccc; border-radius: 50%; cursor: pointer;" title="イエロー"></button>
                                <button onclick="changeColor('<?php echo esc_js($unique_id); ?>', '#ff9800')" style="width: 28px; height: 28px; background: #ff9800; border: 2px solid #ccc; border-radius: 50%; cursor: pointer;" title="オレンジ"></button>
                                <button onclick="changeColor('<?php echo esc_js($unique_id); ?>', '#2196f3')" style="width: 28px; height: 28px; background: #2196f3; border: 2px solid #ccc; border-radius: 50%; cursor: pointer;" title="ブルー"></button>
                                <button onclick="changeColor('<?php echo esc_js($unique_id); ?>', '#4caf50')" style="width: 28px; height: 28px; background: #4caf50; border: 2px solid #ccc; border-radius: 50%; cursor: pointer;" title="グリーン"></button>
                                <button onclick="changeColor('<?php echo esc_js($unique_id); ?>', '#f44336')" style="width: 28px; height: 28px; background: #f44336; border: 2px solid #ccc; border-radius: 50%; cursor: pointer;" title="レッド"></button>
                                <button onclick="changeColor('<?php echo esc_js($unique_id); ?>', '#ffffff')" style="width: 28px; height: 28px; background: #ffffff; border: 2px solid #999; border-radius: 50%; cursor: pointer;" title="ホワイト"></button>
                                <button onclick="changeColor('<?php echo esc_js($unique_id); ?>', '#000000')" style="width: 28px; height: 28px; background: #000000; border: 2px solid #ccc; border-radius: 50%; cursor: pointer;" title="ブラック"></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 閉じるボタン -->
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="hideCustomizer('<?php echo esc_js($unique_id); ?>')" style="padding: 12px 24px; background: #f8bbd9; color: white; border: none; border-radius: 20px; font-weight: 600; cursor: pointer;">
                        ツールを閉じる
                    </button>
                </div>
            </div>

            <script>
                // グローバル変数
                var customizers = {};
                
                function showCustomizer(id) {
                    document.getElementById(id + '-initial').style.display = 'none';
                    document.getElementById(id + '-customize').style.display = 'block';
                    
                    // 初期化
                    if (!customizers[id]) {
                        customizers[id] = {
                            shape: 'circle',
                            size: 120,
                            color: '#ffffff'
                        };
                    }
                }
                
                function hideCustomizer(id) {
                    document.getElementById(id + '-initial').style.display = 'block';
                    document.getElementById(id + '-customize').style.display = 'none';
                }
                
                function changeShape(id, shape) {
                    customizers[id].shape = shape;
                    updatePreview(id);
                    console.log('形状変更:', shape);
                }
                
                function changeSize(id, increment) {
                    customizers[id].size = Math.max(50, Math.min(200, customizers[id].size + increment));
                    document.getElementById(id + '-size').textContent = customizers[id].size + '%';
                    updatePreview(id);
                    console.log('サイズ変更:', customizers[id].size);
                }
                
                function changeColor(id, color) {
                    customizers[id].color = color;
                    updatePreview(id);
                    console.log('色変更:', color);
                }
                
                function updatePreview(id) {
                    var preview = document.getElementById(id + '-preview');
                    var config = customizers[id];
                    
                    // 背景色を強制適用
                    preview.style.backgroundColor = config.color;
                    preview.style.background = config.color;
                    
                    // 形状
                    if (config.shape === 'circle') {
                        preview.style.borderRadius = '50%';
                    } else {
                        preview.style.borderRadius = '16px';
                    }
                    
                    // サイズ
                    var img = preview.querySelector('img');
                    if (img) {
                        var size = Math.round(120 * config.size / 100);
                        img.style.width = size + 'px';
                        img.style.height = size + 'px';
                    }
                }
                
                function downloadOriginal(imageUrl) {
                    var link = document.createElement('a');
                    link.download = 'original-icon-' + Date.now() + '.png';
                    link.href = imageUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    console.log('元画像をダウンロード');
                }
                
                function downloadCustomized(id) {
                    console.log('=== ダウンロード開始 ===');
                    console.log('ID:', id);
                    console.log('全カスタマイザー:', customizers);
                    console.log('対象設定:', customizers[id]);
                    
                    // カスタマイザーが初期化されていない場合は初期化
                    if (!customizers[id]) {
                        console.log('設定が未初期化のため初期化します');
                        customizers[id] = {
                            shape: 'circle',
                            size: 120,
                            color: '#ffffff'
                        };
                    }
                    
                    var config = customizers[id];
                    
                    console.log('使用する設定:', {
                        shape: config.shape,
                        size: config.size,
                        color: config.color
                    });
                    
                    var preview = document.getElementById(id + '-preview');
                    var img = preview.querySelector('img');
                    
                    if (!img) {
                        alert('画像が見つかりません');
                        return;
                    }
                    
                    // 高解像度Canvas作成
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var downloadSize = 1024; // 高解像度
                    
                    canvas.width = downloadSize;
                    canvas.height = downloadSize;
                    
                    // 新しいImageオブジェクトを作成（CORS対応）
                    var newImg = new Image();
                    newImg.crossOrigin = 'anonymous';
                    
                    newImg.onload = function() {
                        console.log('=== Canvas描画開始 ===');
                        console.log('画像読み込み完了:', newImg.src);
                        
                        // 画像サイズ計算（基準サイズ120pxをベースに高解像度用にスケール）
                        var baseSize = 120; // プレビューでの基準サイズ
                        var scaledBaseSize = (downloadSize / 200) * baseSize; // 1024/200*120 = 614.4px が基準
                        var imageSize = Math.round((scaledBaseSize * config.size) / 100);
                        console.log('画像サイズ計算:', {
                            基準サイズ: baseSize + 'px',
                            高解像度基準: scaledBaseSize + 'px', 
                            設定パーセンテージ: config.size + '%',
                            最終サイズ: imageSize + 'px'
                        });
                        
                        if (config.shape === 'circle') {
                            console.log('円形で描画');
                            // 円形の場合
                            ctx.beginPath();
                            ctx.arc(downloadSize / 2, downloadSize / 2, downloadSize / 2, 0, Math.PI * 2);
                            ctx.fillStyle = config.color;
                            ctx.fill();
                            ctx.clip();
                        } else {
                            console.log('角丸四角で描画');
                            // 角丸四角の場合
                            var radius = downloadSize * 0.1; // 10%の角丸
                            drawRoundedRect(ctx, 0, 0, downloadSize, downloadSize, radius);
                            ctx.fillStyle = config.color;
                            ctx.fill();
                            ctx.clip();
                        }
                        
                        console.log('背景色:', config.color);
                        
                        // 画像を描画
                        var imgX = (downloadSize - imageSize) / 2;
                        var imgY = (downloadSize - imageSize) / 2;
                        console.log('画像描画位置:', 'x=' + imgX, 'y=' + imgY, 'サイズ=' + imageSize);
                        ctx.drawImage(newImg, imgX, imgY, imageSize, imageSize);
                        
                        // ダウンロード実行
                        var link = document.createElement('a');
                        link.download = 'custom-icon-' + Date.now() + '.png';
                        link.href = canvas.toDataURL('image/png');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        console.log('ダウンロード完了', {
                            最終設定: config,
                            キャンバスサイズ: downloadSize,
                            画像サイズ: imageSize
                        });
                    };
                    
                    newImg.onerror = function() {
                        alert('画像の読み込みに失敗しました');
                    };
                    
                    newImg.src = img.src;
                }
                
                // 角丸四角形描画関数
                function drawRoundedRect(ctx, x, y, width, height, radius) {
                    ctx.beginPath();
                    ctx.moveTo(x + radius, y);
                    ctx.lineTo(x + width - radius, y);
                    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                    ctx.lineTo(x + width, y + height - radius);
                    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                    ctx.lineTo(x + radius, y + height);
                    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                    ctx.lineTo(x, y + radius);
                    ctx.quadraticCurveTo(x, y, x + radius, y);
                    ctx.closePath();
                }
            </script>
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
     * 
     * WordPressのブロックエディター（Gutenberg）で必要なCSS・JSを読み込む。
     * エディター画面でのみ動作し、フロントエンドには影響しない。
     * 
     * 読み込まれるアセット:
     * 1. editor-preview.css - ショートコードプレビュー用スタイル
     * 2. custom-block.js - Icon Customizerカスタムブロック（メイン機能）
     * 3. custom-block.css - カスタムブロック専用スタイル
     * 4. editor.js - エディター拡張機能（補助機能）
     * 
     * 実行タイミング:
     * - enqueue_block_editor_assets フックで実行
     * - 投稿・固定ページの編集画面でのみ有効
     * 
     * 依存関係:
     * - wp-blocks: WordPressブロック機能
     * - wp-element: React要素作成機能
     * - wp-components: WordPress標準UIコンポーネント
     * - wp-block-editor: ブロックエディター統合機能
     * - wp-media-utils: メディアアップロード機能
     */
    public function enqueue_editor_assets() {
        
        // ===== エディタープレビュー用CSS読み込み =====
        // ショートコードプレビューのスタイリングを提供
        wp_enqueue_style(
            'icon-customizer-editor-preview-css',  // ハンドル名（一意識別子）
            ICON_CUSTOMIZER_PLUGIN_URL . 'assets/editor-preview.css',  // CSSファイルパス
            array(),  // 依存関係なし
            ICON_CUSTOMIZER_VERSION  // バージョン（キャッシュ制御用）
        );
        
        // ===== カスタムブロック用CSS読み込み =====
        // Icon Customizerカスタムブロックのエディター内スタイリング
        wp_enqueue_style(
            'icon-customizer-custom-block-css',  // ハンドル名
            ICON_CUSTOMIZER_PLUGIN_URL . 'assets/custom-block.css',  // CSSファイルパス
            array(),  // 依存関係なし
            ICON_CUSTOMIZER_VERSION  // バージョン
        );
        
        // ===== Icon Customizerカスタムブロック JavaScript読み込み =====
        // メイン機能: 直感的なブロック編集UI、リアルタイムプレビュー、ショートコード出力
        wp_enqueue_script(
            'icon-customizer-custom-block-js',  // ハンドル名
            ICON_CUSTOMIZER_PLUGIN_URL . 'assets/custom-block.js',  // JSファイルパス
            array(
                'wp-blocks',        // ブロック登録API
                'wp-element',       // React要素作成
                'wp-components',    // WordPress標準UIコンポーネント
                'wp-block-editor',  // ブロックエディター統合
                'wp-media-utils'    // メディアアップロード機能
            ),
            ICON_CUSTOMIZER_VERSION,  // バージョン
            true  // フッターで読み込み（ページ読み込み速度向上）
        );
        
        // ===== 補助的なエディター拡張JavaScript読み込み =====
        // 補助機能: エディター監視、デバッグ機能、将来的な機能拡張基盤
        wp_enqueue_script(
            'icon-customizer-editor-js',  // ハンドル名
            ICON_CUSTOMIZER_PLUGIN_URL . 'assets/editor.js',  // JSファイルパス
            array('wp-blocks', 'wp-element', 'wp-editor'),  // WordPress標準の依存関係
            ICON_CUSTOMIZER_VERSION,  // バージョン
            true  // フッターで読み込み
        );
        
        // ===== エディター用設定をJavaScriptに渡す =====
        // カスタムブロックとエディター拡張機能で共有する設定情報
        wp_localize_script(
            'icon-customizer-custom-block-js',  // メインのカスタムブロックスクリプト
            'iconCustomizerEditor',  // JavaScript変数名
            array(
                'pluginUrl' => ICON_CUSTOMIZER_PLUGIN_URL,  // プラグインURL
                'version' => ICON_CUSTOMIZER_VERSION,  // バージョン情報
                'nonce' => wp_create_nonce('icon_customizer_editor'),  // セキュリティトークン
                'defaultImage' => ICON_CUSTOMIZER_PLUGIN_URL . 'assets/dummy-icon.png',  // デフォルト画像
                'strings' => array(  // 翻訳可能な文字列
                    'blockTitle' => __('Icon Customizer', 'icon-customizer'),
                    'blockDescription' => __('カスタマイズ可能なアイコンを挿入します', 'icon-customizer'),
                    'imageLabel' => __('画像URL', 'icon-customizer'),
                    'shapeLabel' => __('形状', 'icon-customizer'),
                    'sizeLabel' => __('サイズ', 'icon-customizer'),
                    'previewTitle' => __('プレビュー', 'icon-customizer'),
                    'errorImageLoad' => __('画像を読み込めませんでした', 'icon-customizer'),
                    'selectFromLibrary' => __('メディアライブラリから選択', 'icon-customizer'),
                    'enterUrlDirectly' => __('URLを直接入力', 'icon-customizer'),
                    'circleShape' => __('円形', 'icon-customizer'),
                    'squareShape' => __('四角形', 'icon-customizer'),
                )
            )
        );
        
        // ===== 補助エディター機能用設定 =====
        // editor.js 用の設定情報（別途設定）
        wp_localize_script(
            'icon-customizer-editor-js',  // 補助エディタースクリプト
            'iconCustomizerEditorConfig',  // 別の変数名で混同を避ける
            array(
                'pluginUrl' => ICON_CUSTOMIZER_PLUGIN_URL,
                'version' => ICON_CUSTOMIZER_VERSION,
                'debug' => WP_DEBUG,  // デバッグモード情報
                'blockName' => 'icon-customizer/icon-block'  // 登録されるブロック名
            )
        );
    }
    
    /**
     * ショートコードプレビュー（ブロックエディター用）
     * 
     * WordPressのブロックエディターで[icon_customizer]ショートコードを入力した際に、
     * SWELLブロックのように実際のプレビューを表示する機能。
     * 
     * 処理フロー:
     * 1. ブロックコンテンツから[icon_customizer]ショートコードを検出
     * 2. ショートコード属性（image等）を解析
     * 3. サーバーサイドで静的なプレビューHTMLを生成
     * 4. エディター専用CSSでスタイリング
     * 
     * @param string $block_content ブロックの元のHTML内容
     * @param array  $block         ブロック情報（blockName等）
     * @return string               プレビューHTML付きのブロック内容
     */
    public function render_shortcode_preview($block_content, $block) {
        // カスタムブロックまたはショートコードブロックでicon_customizerが含まれる場合に処理
        $should_preview = false;
        
        // 1. 通常のショートコードブロック
        if (isset($block['blockName']) && $block['blockName'] === 'core/shortcode') {
            if (strpos($block_content, '[icon_customizer') !== false) {
                $should_preview = true;
            }
        }
        
        // 2. カスタムブロック（icon-customizer/icon-block）
        if (isset($block['blockName']) && $block['blockName'] === 'icon-customizer/icon-block') {
            $should_preview = true;
        }
        
        // 3. HTMLに直接ショートコードが含まれている場合
        if (strpos($block_content, '[icon_customizer') !== false) {
            $should_preview = true;
        }
        
        if ($should_preview) {
            // ★ ショートコード属性を解析する（詳細なコメント付き実装）
            $shortcode_attributes = $this->parse_shortcode_attributes($block_content);
            
            // ★ サーバーサイドでプレビューHTMLを生成（詳細なコメント付き実装）
            $preview_html = $this->generate_editor_preview_html($shortcode_attributes);
            
            // エディター内でのプレビュー表示（元のブロック内容の前に挿入）
            return $preview_html . $block_content;
        }
        
        return $block_content;
    }
    
    /**
     * ショートコード属性解析機能
     * 
     * ブロックエディター内の[icon_customizer image="xxx"]のような文字列から
     * 属性値を抽出し、プレビュー生成に必要な情報を取得する。
     * 
     * 解析対象の属性:
     * - image: 表示する画像のURL（必須、デフォルト値あり）
     * - width: コンテナの幅（オプション、デフォルト100%）
     * - height: コンテナの高さ（オプション、デフォルトauto）
     * 
     * 処理ロジック:
     * 1. 正規表現でショートコードタグ全体を抽出
     * 2. WordPress標準のshortcode_parse_atts()で属性解析
     * 3. デフォルト値をマージして標準化された配列を返却
     * 
     * @param string $block_content ショートコードを含むブロック内容
     * @return array                解析済み属性配列
     */
    private function parse_shortcode_attributes($block_content) {
        // ショートコードタグを正規表現で抽出
        // パターン説明: [icon_customizer で始まり ] で終わる文字列を捕獲
        if (preg_match('/\[icon_customizer([^\]]*)\]/', $block_content, $matches)) {
            
            // WordPress標準関数でショートコード属性を解析
            // shortcode_parse_atts() は 'key="value"' 形式の文字列を連想配列に変換
            $raw_attributes = shortcode_parse_atts($matches[1]);
            
            // 解析結果がnullの場合は空配列として扱う（エラー回避）
            if (!is_array($raw_attributes)) {
                $raw_attributes = array();
            }
            
        } else {
            // ショートコードが見つからない場合は空配列
            $raw_attributes = array();
        }
        
        // デフォルト値を適用（本体のrender_shortcode()と同じロジック）
        // shortcode_atts()でデフォルト値をマージし、一貫性を保つ
        $parsed_attributes = shortcode_atts(array(
            'image'  => ICON_CUSTOMIZER_PLUGIN_URL . 'assets/dummy-icon.png',
            'width'  => '100%',
            'height' => 'auto'
        ), $raw_attributes);
        
        return $parsed_attributes;
    }
    
    /**
     * エディター用プレビューHTML生成機能
     * 
     * 解析されたショートコード属性を基に、ブロックエディター内で
     * 表示される静的なプレビューHTMLを生成する。
     * 
     * プレビューの特徴:
     * - 実際のフロントエンド表示に近い見た目
     * - 編集不可の静的表示（パフォーマンス重視）
     * - エディター用CSS でスタイリング
     * - 画像読み込みエラーのフォールバック対応
     * 
     * 生成されるHTML構造:
     * <div class="icon-customizer-editor-preview">
     *   <div class="preview-header">プレビューラベル</div>
     *   <div class="preview-content">実際のアイコン表示</div>
     * </div>
     * 
     * @param array $attributes 解析済みショートコード属性
     * @return string           プレビューHTML
     */
    private function generate_editor_preview_html($attributes) {
        // プレビュー表示を完全に無効化
        return '';
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