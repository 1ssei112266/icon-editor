/**
 * Icon Customizer カスタムブロック実装
 * 
 * このファイルはWordPressのGutenbergエディター用のカスタムブロックを定義します。
 * ユーザーが直感的にIcon Customizerを設定・プレビューできるUIを提供し、
 * フロントエンドでは既存のショートコード形式で出力されます。
 * 
 * 主な機能:
 * 1. 画像URL入力フィールド（テキスト入力・ファイルアップロード対応）
 * 2. 形状選択（円形・四角形）
 * 3. サイズ設定（幅・高さ）
 * 4. リアルタイムプレビュー表示
 * 5. ショートコード形式での保存・出力
 * 
 * 技術仕様:
 * - WordPress Block Editor API (Gutenberg) 使用
 * - React JSX記法でUI構築
 * - 属性の状態管理とデータバインディング
 * - メディアライブラリ統合
 * 
 * 依存関係:
 * - wp-blocks: ブロック登録API
 * - wp-element: React-like要素作成
 * - wp-components: WordPress標準UIコンポーネント
 * - wp-block-editor: エディター統合機能
 * - wp-media-utils: メディアアップロード機能
 * 
 * 最終更新: 2025-08-16
 * 作成者: Icon Customizer Development Team
 */

// WordPress Block Editor APIのインポート
// 各モジュールの詳細説明付き
const { 
    registerBlockType     // ブロック登録関数: 新しいブロックタイプを定義
} = wp.blocks;

const { 
    createElement,        // React.createElement相当: JSX要素作成
    Fragment,            // React.Fragment相当: 複数要素のラップ
    useState,            // React.useState相当: 状態管理
    useEffect            // React.useEffect相当: 副作用処理
} = wp.element;

const {
    PanelBody,           // 設定パネルのセクション
    TextControl,         // テキスト入力フィールド
    SelectControl,       // セレクトボックス
    RangeControl,        // スライダー入力
    Button,              // ボタンコンポーネント
    ToggleControl,       // トグルスイッチ
    Notice,              // 通知・エラーメッセージ表示
    Placeholder,         // プレースホルダーコンポーネント
    Spinner             // ローディングスピナー
} = wp.components;

const {
    InspectorControls,   // 右サイドバーの設定パネル
    MediaUpload,         // メディアライブラリアップロード
    MediaUploadCheck,    // アップロード権限チェック
    useBlockProps       // ブロック属性とプロパティの統合
} = wp.blockEditor;

const {
    MediaUploadButton    // メディアアップロードボタン
} = wp.mediaUtils || {};

/**
 * Icon Customizerカスタムブロックの登録
 * 
 * WordPress Block Editor APIを使用してカスタムブロックを登録します。
 * このブロックはエディター内で直感的なUIを提供し、
 * 保存時には既存のショートコード形式で出力されます。
 * 
 * ブロック設定項目:
 * - title: ブロック挿入時の表示名
 * - description: ブロックの説明文
 * - icon: ブロックアイコン（Dashicons使用）
 * - category: ブロックカテゴリ（メディア系に分類）
 * - keywords: 検索キーワード
 * - attributes: ブロックで管理する属性一覧
 * - edit: エディター内での表示・編集UI
 * - save: フロントエンド保存形式
 */
registerBlockType('icon-customizer/icon-block', {
    
    /**
     * ブロック基本情報
     * エディター内でのブロック識別とカテゴライズに使用
     */
    title: 'Icon Customizer',
    description: 'カスタマイズ可能なアイコンを挿入します。画像URL、形状、サイズを設定できます。',
    icon: 'art',                    // Dashiconsのアートアイコンを使用
    category: 'media',              // メディア系ブロックとして分類
    keywords: ['icon', 'image', 'customizer', 'アイコン', '画像'],
    
    /**
     * ブロック属性の定義
     * 
     * WordPressブロックエディターで管理される状態データの定義。
     * 各属性はブロックの設定値を保持し、エディター・フロントエンド間で共有されます。
     * 
     * 属性設計方針:
     * - 既存ショートコードとの完全互換性
     * - デフォルト値の明確な定義
     * - 型安全性の確保
     */
    attributes: {
        
        /**
         * 画像URL属性
         * 
         * 用途: 表示するアイコン画像のURLを保存
         * 入力方法: テキスト直接入力 or メディアライブラリ選択
         * デフォルト: プラグインのダミー画像
         * バリデーション: URL形式チェック（フロントエンドで実施）
         */
        imageUrl: {
            type: 'string',                                    // 文字列型
            default: '',                                       // 空文字をデフォルトに
            source: 'attribute',                              // HTML属性から値を取得
            selector: 'img',                                  // img要素を対象
            attribute: 'src'                                  // src属性から値を読み取り
        },
        
        /**
         * アイコン形状属性
         * 
         * 用途: アイコンの表示形状を制御（円形・四角形）
         * 選択肢: 'circle' | 'square'
         * デフォルト: circle（円形）
         * UI: ラジオボタンまたはセレクトボックス
         */
        shape: {
            type: 'string',                                    // 文字列型
            default: 'circle',                                // デフォルトは円形
            enum: ['circle', 'square']                        // 許可される値を限定
        },
        
        /**
         * コンテナ幅属性
         * 
         * 用途: ブロック全体の幅設定
         * 入力形式: CSS値（%, px, em等）
         * デフォルト: 100%（親要素の幅に合わせる）
         * 例: '300px', '50%', '20em'
         */
        width: {
            type: 'string',                                    // 文字列型（CSS値対応）
            default: '100%'                                   // 親要素の幅に合わせる
        },
        
        /**
         * コンテナ高さ属性
         * 
         * 用途: ブロック全体の高さ設定
         * 入力形式: CSS値（%, px, em, auto等）
         * デフォルト: auto（内容に応じて自動調整）
         * 例: 'auto', '400px', '30vh'
         */
        height: {
            type: 'string',                                    // 文字列型（CSS値対応）
            default: 'auto'                                   // 内容に応じて自動調整
        },
        
        /**
         * アイコンサイズ属性（将来拡張用）
         * 
         * 用途: アイコン画像自体のサイズ調整
         * 入力形式: パーセンテージ（10-200%）
         * デフォルト: 120%（やや大きめに表示）
         * 注意: 現在は基本実装、将来的にスライダーで調整可能に
         */
        iconScale: {
            type: 'number',                                   // 数値型
            default: 120                                      // 120%サイズ
        },
        
        /**
         * 背景色属性（将来拡張用）
         * 
         * 用途: アイコン背景の色設定
         * 入力形式: HEX色コード
         * デフォルト: ブルー系グラデーション
         * UI: カラーピッカーで選択
         */
        backgroundColor: {
            type: 'string',                                   // 文字列型（色コード）
            default: '#60a5fa'                               // 青色をデフォルト
        }
    },
    
    /**
     * エディター内表示・編集コンポーネント
     * 
     * ブロックエディター内での表示とユーザーインタラクションを定義します。
     * React関数コンポーネント形式で実装し、リアルタイムプレビューと
     * 直感的な設定UIを提供します。
     * 
     * @param {Object} props - ブロックプロパティ
     * @param {Object} props.attributes - ブロック属性オブジェクト
     * @param {Function} props.setAttributes - 属性更新関数
     * @param {boolean} props.isSelected - ブロック選択状態
     * @returns {JSX.Element} エディター内表示要素
     */
    edit: function EditComponent(props) {
        
        // ===== プロパティの分割代入 =====
        // WordPress Block Editor APIから渡されるプロパティを取得
        const { 
            attributes,      // ブロックの現在の属性値
            setAttributes,   // 属性を更新するための関数
            isSelected      // ブロックが選択されているかどうか
        } = props;
        
        // ===== 属性値の分割代入 =====
        // attributes オブジェクトから個別の属性を取得
        const {
            imageUrl,        // 画像URL
            shape,           // アイコン形状
            width,           // コンテナ幅
            height,          // コンテナ高さ
            iconScale,       // アイコンサイズ
            backgroundColor  // 背景色
        } = attributes;
        
        // ===== 状態管理 =====
        // React Hooksを使用したローカル状態の管理
        
        /**
         * 画像読み込み状態の管理
         * 
         * 用途: 画像URL変更時のローディング表示制御
         * 状態: 'idle' | 'loading' | 'loaded' | 'error'
         * 初期値: 'idle'（何もしていない状態）
         */
        const [imageLoadState, setImageLoadState] = useState('idle');
        
        /**
         * エラーメッセージ状態の管理
         * 
         * 用途: ユーザーへのエラー通知表示
         * 形式: { message: string, type: 'error' | 'warning' | 'info' }
         * 初期値: null（エラーなし）
         */
        const [errorMessage, setErrorMessage] = useState(null);
        
        /**
         * URL入力フィールドの表示状態管理
         * 
         * 用途: メディアライブラリとURL直接入力の切り替え
         * 状態: true（URL入力表示） | false（メディアライブラリボタン表示）
         * 初期値: false（メディアライブラリボタンを優先表示）
         */
        const [showUrlInput, setShowUrlInput] = useState(false);
        
        // ===== 副作用処理（useEffect） =====
        
        /**
         * 画像URL変更時の処理
         * 
         * 画像URLが変更された際に実行される副作用処理。
         * 画像の存在確認とエラーハンドリングを行います。
         * 
         * 処理フロー:
         * 1. URLが空でない場合のみ処理実行
         * 2. ローディング状態に設定
         * 3. Image オブジェクトで画像読み込みテスト
         * 4. 成功時: loaded状態、エラークリア
         * 5. 失敗時: error状態、エラーメッセージ表示
         */
        useEffect(() => {
            
            // 空のURLの場合は処理をスキップ
            if (!imageUrl || imageUrl.trim() === '') {
                setImageLoadState('idle');
                setErrorMessage(null);
                return;
            }
            
            // ローディング状態に設定
            setImageLoadState('loading');
            setErrorMessage(null);
            
            // 画像オブジェクトを作成して読み込みテスト
            const testImage = new Image();
            
            /**
             * 画像読み込み成功時のハンドラー
             * 
             * 画像が正常に読み込まれた場合に実行されます。
             * ローディング状態を解除し、エラーメッセージをクリアします。
             */
            testImage.onload = function() {
                setImageLoadState('loaded');
                setErrorMessage(null);
                
                // デバッグ用ログ（開発時のみ）
                if (typeof console !== 'undefined' && console.log) {
                    console.log('Icon Customizer: 画像読み込み成功', imageUrl);
                }
            };
            
            /**
             * 画像読み込み失敗時のハンドラー
             * 
             * 画像の読み込みに失敗した場合に実行されます。
             * エラー状態に設定し、ユーザーに分かりやすいエラーメッセージを表示します。
             */
            testImage.onerror = function() {
                setImageLoadState('error');
                setErrorMessage({
                    message: '画像を読み込めませんでした。URLを確認してください。',
                    type: 'error'
                });
                
                // デバッグ用ログ（開発時のみ）
                if (typeof console !== 'undefined' && console.warn) {
                    console.warn('Icon Customizer: 画像読み込み失敗', imageUrl);
                }
            };
            
            // 画像読み込み開始
            testImage.src = imageUrl;
            
            // クリーンアップ関数
            // useEffectのクリーンアップでイベントリスナーを削除
            return function cleanup() {
                testImage.onload = null;
                testImage.onerror = null;
            };
            
        }, [imageUrl]);  // imageUrl が変更された時のみ実行
        
        // ===== イベントハンドラー関数群 =====
        
        /**
         * 画像URL変更ハンドラー
         * 
         * テキスト入力フィールドでの画像URL変更を処理します。
         * 入力値のバリデーションと属性更新を行います。
         * 
         * @param {string} newUrl - 新しい画像URL
         */
        const handleImageUrlChange = function(newUrl) {
            
            // 入力値の前後空白を除去
            const trimmedUrl = newUrl ? newUrl.trim() : '';
            
            // 属性を更新（この時点でuseEffectが発火して画像検証開始）
            setAttributes({ imageUrl: trimmedUrl });
            
            // デバッグ用ログ
            if (typeof console !== 'undefined' && console.log) {
                console.log('Icon Customizer: URL変更', trimmedUrl);
            }
        };
        
        /**
         * メディアライブラリ選択ハンドラー
         * 
         * WordPressメディアライブラリから画像が選択された際の処理。
         * 選択された画像の情報を取得し、適切な画像URLを設定します。
         * 
         * @param {Object} media - メディアライブラリから選択されたメディアオブジェクト
         * @param {string} media.url - 画像のURL
         * @param {number} media.id - メディアID
         * @param {string} media.alt - 代替テキスト
         * @param {Object} media.sizes - 利用可能な画像サイズ一覧
         */
        const handleMediaSelect = function(media) {
            
            // メディアオブジェクトが正常かチェック
            if (!media || !media.url) {
                setErrorMessage({
                    message: 'メディアの選択に失敗しました。',
                    type: 'error'
                });
                return;
            }
            
            // 最適な画像サイズを選択
            // 利用可能なサイズ: thumbnail, medium, large, full
            let selectedUrl = media.url;  // デフォルトはフルサイズ
            
            // medium サイズが利用可能な場合はそれを優先
            // （プレビュー表示に適したサイズのため）
            if (media.sizes && media.sizes.medium && media.sizes.medium.url) {
                selectedUrl = media.sizes.medium.url;
            }
            
            // 画像URLを更新
            setAttributes({ imageUrl: selectedUrl });
            
            // URL直接入力フィールドを非表示に戻す
            setShowUrlInput(false);
            
            // デバッグ用ログ
            if (typeof console !== 'undefined' && console.log) {
                console.log('Icon Customizer: メディア選択', {
                    id: media.id,
                    url: selectedUrl,
                    alt: media.alt
                });
            }
        };
        
        /**
         * 形状変更ハンドラー
         * 
         * アイコンの形状（円形・四角形）変更を処理します。
         * 
         * @param {string} newShape - 新しい形状 ('circle' | 'square')
         */
        const handleShapeChange = function(newShape) {
            setAttributes({ shape: newShape });
        };
        
        /**
         * サイズ変更ハンドラー
         * 
         * コンテナの幅・高さ変更を処理します。
         * 
         * @param {string} dimension - 変更する次元 ('width' | 'height')
         * @param {string} newValue - 新しいサイズ値
         */
        const handleSizeChange = function(dimension, newValue) {
            const updateObject = {};
            updateObject[dimension] = newValue;
            setAttributes(updateObject);
        };
        
        // ===== プレビュー用スタイル計算 =====
        
        /**
         * プレビューコンテナのスタイル計算
         * 
         * エディター内プレビュー表示用のCSSスタイルオブジェクトを生成します。
         * ユーザーの設定値を反映した見た目を提供します。
         */
        const previewContainerStyle = {
            width: width || '100%',                           // 幅設定（デフォルト100%）
            height: height || 'auto',                        // 高さ設定（デフォルトauto）
            minHeight: '200px',                             // 最小高さを確保
            background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',  // 背景グラデーション
            borderRadius: '8px',                            // 角丸
            display: 'flex',                                // Flexbox中央配置
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',                                // 内側余白
            border: '2px solid #e2e8f0',                   // ボーダー
            position: 'relative'                            // 相対位置（子要素の絶対配置用）
        };
        
        /**
         * アイコン背景のスタイル計算
         * 
         * アイコンの背景形状とサイズを設定します。
         * 円形・四角形の切り替えとサイズ調整を反映します。
         */
        const iconBackgroundStyle = {
            width: '80px',                                  // 固定サイズ（エディタープレビュー用）
            height: '80px',
            background: `linear-gradient(135deg, ${backgroundColor}, #3b82f6)`,  // 背景グラデーション
            borderRadius: shape === 'circle' ? '50%' : '10%',  // 形状に応じた角丸
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)', // ドロップシャドウ
            transition: 'all 0.3s ease'                    // アニメーション
        };
        
        /**
         * アイコン画像のスタイル計算
         * 
         * アイコン画像本体のサイズとフィッティングを設定します。
         */
        const iconImageStyle = {
            width: `${Math.round(48 * (iconScale / 100))}px`,   // スケールに応じたサイズ
            height: `${Math.round(48 * (iconScale / 100))}px`,
            objectFit: 'contain',                           // アスペクト比維持
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'  // ドロップシャドウ
        };
        
        // ===== JSX レンダリング =====
        
        /**
         * ブロックプロパティの設定
         * 
         * WordPress Block Editor標準のuseBlockPropsフックを使用して
         * ブロック要素に必要な属性とイベントハンドラーを設定します。
         */
        const blockProps = useBlockProps({
            className: 'icon-customizer-block-editor'       // カスタムCSSクラス
        });
        
        // メインJSXレンダリング
        return createElement(Fragment, null,
            
            // ===== 右サイドバー設定パネル =====
            // ブロック選択時に右サイドバーに表示される設定UI
            createElement(InspectorControls, null,
                
                // 基本設定パネル
                createElement(PanelBody, {
                    title: '基本設定',
                    initialOpen: true                       // デフォルトで開いた状態
                },
                    
                    // 画像URL設定セクション
                    createElement('div', {
                        style: { marginBottom: '16px' }
                    },
                        createElement('h4', {
                            style: { 
                                margin: '0 0 8px 0',
                                fontSize: '14px',
                                fontWeight: '600' 
                            }
                        }, '📷 画像設定'),
                        
                        // メディアライブラリボタン（アップロード権限がある場合）
                        typeof MediaUploadCheck !== 'undefined' 
                            ? createElement(MediaUploadCheck, null,
                                createElement(MediaUpload, {
                                    onSelect: handleMediaSelect,
                                    allowedTypes: ['image'],        // 画像ファイルのみ許可
                                    value: null,
                                    render: function(renderProps) {
                                        return createElement(Button, {
                                            onClick: renderProps.open,
                                            variant: 'secondary',
                                            style: { 
                                                width: '100%',
                                                marginBottom: '8px' 
                                            }
                                        }, '📁 メディアライブラリから選択');
                                    }
                                })
                            )
                            : null,
                        
                        // URL直接入力切り替えボタン
                        createElement(Button, {
                            onClick: function() { 
                                setShowUrlInput(!showUrlInput); 
                            },
                            variant: 'link',
                            style: { 
                                fontSize: '12px',
                                height: 'auto',
                                padding: '4px 0' 
                            }
                        }, showUrlInput ? '📁 メディアライブラリに戻る' : '🔗 URLを直接入力'),
                        
                        // URL直接入力フィールド（条件付き表示）
                        showUrlInput ? createElement(TextControl, {
                            label: '画像URL',
                            value: imageUrl,
                            onChange: handleImageUrlChange,
                            placeholder: 'https://example.com/icon.png',
                            help: 'アイコンとして使用する画像のURLを入力してください'
                        }) : null
                    ),
                    
                    // 形状選択セクション
                    createElement(SelectControl, {
                        label: '🔵 形状',
                        value: shape,
                        options: [
                            { label: '● 円形', value: 'circle' },
                            { label: '■ 四角形', value: 'square' }
                        ],
                        onChange: handleShapeChange,
                        help: 'アイコンの表示形状を選択してください'
                    })
                ),
                
                // サイズ設定パネル
                createElement(PanelBody, {
                    title: 'サイズ設定',
                    initialOpen: false                      // デフォルトで閉じた状態
                },
                    
                    // コンテナ幅設定
                    createElement(TextControl, {
                        label: '📐 幅',
                        value: width,
                        onChange: function(newWidth) {
                            handleSizeChange('width', newWidth);
                        },
                        placeholder: '例: 100%, 300px, 20em',
                        help: 'ブロック全体の幅を指定してください（CSS値）'
                    }),
                    
                    // コンテナ高さ設定
                    createElement(TextControl, {
                        label: '📏 高さ',
                        value: height,
                        onChange: function(newHeight) {
                            handleSizeChange('height', newHeight);
                        },
                        placeholder: '例: auto, 400px, 50vh',
                        help: 'ブロック全体の高さを指定してください（CSS値）'
                    }),
                    
                    // アイコンスケール設定（将来拡張用）
                    createElement(RangeControl, {
                        label: '🔍 アイコンサイズ',
                        value: iconScale,
                        onChange: function(newScale) {
                            setAttributes({ iconScale: newScale });
                        },
                        min: 50,                            // 最小50%
                        max: 200,                           // 最大200%
                        step: 10,                           // 10%刻み
                        help: `アイコン画像のサイズ調整（現在: ${iconScale}%）`
                    })
                )
            ),
            
            // ===== メインエディター表示エリア =====
            // ブロックエディター内でのメイン表示領域
            createElement('div', blockProps,
                
                // エラーメッセージ表示（エラーがある場合のみ）
                errorMessage ? createElement(Notice, {
                    status: errorMessage.type,
                    isDismissible: true,
                    onRemove: function() {
                        setErrorMessage(null);
                    }
                }, errorMessage.message) : null,
                
                // ブロックヘッダー
                createElement('div', {
                    style: {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: '8px 8px 0 0',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }
                },
                    createElement('span', { 
                        style: { fontSize: '16px' } 
                    }, '🎨'),
                    createElement('span', null, 'Icon Customizer'),
                    createElement('span', {
                        style: {
                            marginLeft: 'auto',
                            fontSize: '11px',
                            opacity: '0.8'
                        }
                    }, imageUrl ? '設定済み' : '未設定')
                ),
                
                // メインプレビューエリア
                createElement('div', {
                    style: previewContainerStyle
                },
                    
                    // 画像が設定されていない場合のプレースホルダー
                    !imageUrl ? createElement('div', {
                        style: {
                            textAlign: 'center',
                            color: '#64748b'
                        }
                    },
                        createElement('div', {
                            style: { fontSize: '48px', marginBottom: '12px' }
                        }, '🖼️'),
                        createElement('p', {
                            style: { 
                                margin: '0',
                                fontSize: '14px',
                                fontWeight: '500' 
                            }
                        }, '画像を設定してください'),
                        createElement('p', {
                            style: { 
                                margin: '4px 0 0 0',
                                fontSize: '12px',
                                opacity: '0.7' 
                            }
                        }, '右サイドバーから画像URLまたはメディアライブラリを選択')
                    ) : 
                    
                    // 画像が設定されている場合のプレビュー表示
                    createElement('div', {
                        style: { textAlign: 'center' }
                    },
                        
                        // アイコン背景とローディング表示
                        createElement('div', {
                            style: iconBackgroundStyle
                        },
                            
                            // ローディング中の表示
                            imageLoadState === 'loading' ? 
                                createElement(Spinner) : 
                            
                            // エラー時の表示
                            imageLoadState === 'error' ? 
                                createElement('div', {
                                    style: {
                                        fontSize: '20px',
                                        color: 'rgba(255,255,255,0.8)'
                                    }
                                }, '❌') :
                            
                            // 正常時の画像表示
                            createElement('img', {
                                src: imageUrl,
                                alt: 'Icon Preview',
                                style: iconImageStyle,
                                onLoad: function() {
                                    setImageLoadState('loaded');
                                },
                                onError: function() {
                                    setImageLoadState('error');
                                }
                            })
                        ),
                        
                        // プレビュー説明テキスト
                        createElement('div', {
                            style: {
                                marginTop: '12px',
                                fontSize: '12px',
                                color: '#64748b'
                            }
                        }, `形状: ${shape === 'circle' ? '円形' : '四角形'} | サイズ: ${iconScale}%`)
                    )
                ),
                
                // 設定状況表示フッター
                createElement('div', {
                    style: {
                        background: '#f8f9fa',
                        padding: '8px 16px',
                        borderRadius: '0 0 8px 8px',
                        fontSize: '11px',
                        color: '#64748b',
                        borderTop: '1px solid #e2e8f0'
                    }
                },
                    createElement('div', null, `📐 ${width} × ${height}`),
                    imageUrl ? createElement('div', {
                        style: { 
                            marginTop: '2px',
                            wordBreak: 'break-all' 
                        }
                    }, `🔗 ${imageUrl.length > 50 ? imageUrl.substring(0, 50) + '...' : imageUrl}`) : null
                )
            )
        );
    },
    
    /**
     * フロントエンド保存形式
     * 
     * ブロックがフロントエンドで表示される際の出力形式を定義します。
     * 既存のショートコード形式で出力することで、
     * 既存のReactアプリケーションとの完全な互換性を保ちます。
     * 
     * 出力形式: [icon_customizer image="..." width="..." height="..."]
     * 
     * @param {Object} props - 保存時のプロパティ
     * @param {Object} props.attributes - ブロック属性
     * @returns {JSX.Element|null} 保存される要素（ショートコード）
     */
    save: function SaveComponent(props) {
        
        // 属性値を取得
        const { 
            imageUrl, 
            width, 
            height 
        } = props.attributes;
        
        // ショートコード用属性の構築
        const shortcodeAttributes = [];
        
        // 画像URLが設定されている場合のみ追加
        if (imageUrl && imageUrl.trim() !== '') {
            shortcodeAttributes.push(`image="${imageUrl}"`);
        }
        
        // 幅がデフォルト値でない場合のみ追加
        if (width && width !== '100%') {
            shortcodeAttributes.push(`width="${width}"`);
        }
        
        // 高さがデフォルト値でない場合のみ追加
        if (height && height !== 'auto') {
            shortcodeAttributes.push(`height="${height}"`);
        }
        
        // ショートコード文字列の生成
        const shortcodeString = `[icon_customizer${shortcodeAttributes.length > 0 ? ' ' + shortcodeAttributes.join(' ') : ''}]`;
        
        // プレーンテキストとしてショートコードを出力
        // これにより既存のショートコード処理システムが正常に動作
        return createElement('div', {
            dangerouslySetInnerHTML: {
                __html: shortcodeString
            }
        });
    }
});

/**
 * デバッグ用グローバル関数
 * 
 * 開発・デバッグ時に便利な関数をグローバルスコープに公開します。
 * ブラウザのコンソールから直接呼び出して動作確認が可能です。
 */
window.iconCustomizerBlockDebug = {
    
    /**
     * 登録されたブロック情報を取得
     * 
     * @returns {Object} ブロック登録情報
     */
    getBlockInfo: function() {
        return wp.blocks.getBlockType('icon-customizer/icon-block');
    },
    
    /**
     * 現在のブロック一覧を取得
     * 
     * @returns {Array} 登録済みブロック一覧
     */
    getAllBlocks: function() {
        return wp.blocks.getBlockTypes();
    },
    
    /**
     * デバッグ情報を出力
     */
    debugInfo: function() {
        console.log('Icon Customizer Block Debug Info:', {
            blockRegistered: !!wp.blocks.getBlockType('icon-customizer/icon-block'),
            wpVersion: typeof wp !== 'undefined',
            hasComponents: typeof wp.components !== 'undefined',
            hasBlockEditor: typeof wp.blockEditor !== 'undefined'
        });
    }
};

// ===== ファイル終了 =====
// Icon Customizer カスタムブロック実装完了