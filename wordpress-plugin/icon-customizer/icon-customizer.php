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
        
        // 設定をJavaScriptに渡す
        $config = array(
            'baseImageUrl' => esc_url($attributes['image']),
            'pluginUrl' => ICON_CUSTOMIZER_PLUGIN_URL,
            'instanceId' => $unique_id
        );
        
        ob_start();
        ?>
        <div id="<?php echo esc_attr($unique_id); ?>-container" class="icon-customizer-container" style="width: <?php echo esc_attr($attributes['width']); ?>; height: <?php echo esc_attr($attributes['height']); ?>;">
            <script type="text/javascript">
                if (!window.ICON_EDITOR_INSTANCES) {
                    window.ICON_EDITOR_INSTANCES = {};
                }
                window.ICON_EDITOR_INSTANCES['<?php echo esc_js($unique_id); ?>'] = <?php echo json_encode($config); ?>;
            </script>
            <div id="<?php echo esc_attr($unique_id); ?>"></div>
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
        // ショートコードブロックかつicon_customizerショートコードが含まれる場合のみ処理
        if (isset($block['blockName']) && $block['blockName'] === 'core/shortcode') {
            if (strpos($block_content, '[icon_customizer') !== false) {
                
                // ★ ショートコード属性を解析する（詳細なコメント付き実装）
                $shortcode_attributes = $this->parse_shortcode_attributes($block_content);
                
                // ★ サーバーサイドでプレビューHTMLを生成（詳細なコメント付き実装）
                $preview_html = $this->generate_editor_preview_html($shortcode_attributes);
                
                // エディター内でのプレビュー表示（元のショートコードブロックの前に挿入）
                return $preview_html . $block_content;
            }
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
        // 属性値を安全な形でHTMLに埋め込むためのエスケープ処理
        $escaped_image_url = esc_url($attributes['image']);
        $escaped_width = esc_attr($attributes['width']);
        $escaped_height = esc_attr($attributes['height']);
        
        // プレビュー用のHTML構築
        // ※ 出力バッファリングを使用して複数行HTMLを安全に構築
        ob_start();
        ?>
        <!-- Icon Customizer エディタープレビュー開始 -->
        <div class="icon-customizer-editor-preview" style="margin: 16px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- プレビューヘッダー: 何のブロックかを明示 -->
            <div class="preview-header" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                font-size: 14px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <!-- アイコンで視覚的にわかりやすく -->
                <span style="font-size: 16px;">🎨</span>
                <span>Icon Customizer</span>
                
                <!-- 設定されている画像URLを小さく表示（開発時の確認用） -->
                <span style="
                    margin-left: auto;
                    font-size: 11px;
                    opacity: 0.8;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                ">
                    <?php echo esc_html(basename($escaped_image_url)); ?>
                </span>
            </div>
            
            <!-- プレビューコンテンツ: 実際のアイコン表示エリア -->
            <div class="preview-content" style="
                background: #f8f9fa;
                padding: 24px;
                text-align: center;
                min-height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            ">
                
                <!-- 背景パターン（チェッカーボード）で透過部分を可視化 -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    opacity: 0.1;
                    background-image: 
                        linear-gradient(45deg, #ccc 25%, transparent 25%), 
                        linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #ccc 75%), 
                        linear-gradient(-45deg, transparent 75%, #ccc 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                "></div>
                
                <!-- メインアイコン表示 -->
                <div style="position: relative; z-index: 1;">
                    
                    <!-- デフォルトの円形背景 (プレビューでは固定設定) -->
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #60a5fa, #3b82f6);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 12px;
                        box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
                    ">
                        <!-- 画像表示 (エラー時はプレースホルダー表示) -->
                        <img 
                            src="<?php echo $escaped_image_url; ?>" 
                            alt="Icon Preview"
                            style="
                                width: 48px;
                                height: 48px;
                                object-fit: contain;
                                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
                            "
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                        />
                        
                        <!-- 画像読み込み失敗時のフォールバック表示 -->
                        <div style="
                            display: none;
                            width: 48px;
                            height: 48px;
                            background: rgba(255,255,255,0.9);
                            border-radius: 4px;
                            align-items: center;
                            justify-content: center;
                            font-size: 20px;
                        ">
                            🖼️
                        </div>
                    </div>
                    
                    <!-- プレビュー説明テキスト -->
                    <div style="
                        font-size: 12px;
                        color: #64748b;
                        margin-top: 8px;
                    ">
                        フロントエンドでカスタマイズ可能
                    </div>
                    
                    <!-- 設定値表示（デバッグ情報として小さく表示） -->
                    <div style="
                        font-size: 10px;
                        color: #94a3b8;
                        margin-top: 4px;
                        opacity: 0.7;
                    ">
                        サイズ: <?php echo $escaped_width; ?> × <?php echo $escaped_height; ?>
                    </div>
                    
                </div>
            </div>
            
        </div>
        <!-- Icon Customizer エディタープレビュー終了 -->
        <?php
        
        // 出力バッファの内容を取得してクリア
        return ob_get_clean();
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