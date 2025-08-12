# 🚀 超シンプル！WordPress アイコンエディター設定ガイド

**プログラミング知識不要・5分で完了**

## 🎯 これでできること

- **1枚の画像**をベースにしたアイコンエディター
- 訪問者が色・形・サイズを自由にカスタマイズ
- 高品質PNG画像をダウンロード可能
- ショートコードでどこでも簡単設置

---

## 📋 必要なもの

- WordPressサイト（管理者権限）
- カスタマイズしてもらいたい**画像1枚**
- 5分間の作業時間

**コーディング：不要** ✅  
**複雑な設定：不要** ✅  
**プラグイン：不要** ✅

---

## 🚀 設定手順（3ステップ）

### Step 1: ファイルアップロード

1. `dist` フォルダの中身をWordPressにアップロード
   ```
   wp-content/themes/あなたのテーマ/icon-editor/
   ├── assets/
   ├── index.html
   └── ...（distフォルダの全ファイル）
   ```

### Step 2: functions.php に追加

**あなたのテーマの `functions.php` に以下をコピペ：**

```php
<?php
// アイコンエディター ショートコード
function icon_editor_shortcode($atts) {
    // 属性のデフォルト値
    $atts = shortcode_atts(array(
        'image' => 'https://picsum.photos/256/256?random=1', // デフォルト画像
        'width' => '100%',
        'height' => '600px'
    ), $atts);
    
    // CSSとJSファイルのURL
    $theme_url = get_template_directory_uri();
    $css_url = $theme_url . '/icon-editor/assets/index-CXaYLNdP.css';
    $js_url = $theme_url . '/icon-editor/assets/index-eVf0jtqa.js';
    
    // HTML出力
    ob_start();
    ?>
    <div id="icon-editor-container" style="width: <?php echo esc_attr($atts['width']); ?>; height: <?php echo esc_attr($atts['height']); ?>;">
        <link rel="stylesheet" href="<?php echo esc_url($css_url); ?>">
        <div id="root"></div>
        <script>
            // グローバル変数で画像URLを設定
            window.ICON_EDITOR_CONFIG = {
                baseImageUrl: '<?php echo esc_js($atts['image']); ?>'
            };
        </script>
        <script type="module" src="<?php echo esc_url($js_url); ?>"></script>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('icon_editor', 'icon_editor_shortcode');
?>
```

### Step 3: 使用方法

**投稿・固定ページで以下のショートコードを使用：**

```
[icon_editor image="https://yoursite.com/wp-content/uploads/2025/08/your-image.png"]
```

**カスタマイズ例：**
```
[icon_editor image="画像URL" width="80%" height="500px"]
```

---

## 🎨 使用例

### 基本的な使用
```
[icon_editor image="https://yoursite.com/wp-content/uploads/logo.png"]
```

### 企業ロゴをカスタマイズ
```
[icon_editor image="https://yoursite.com/wp-content/uploads/company-logo.png" width="100%" height="700px"]
```

### ブログ用アイコン作成
```
[icon_editor image="https://yoursite.com/wp-content/uploads/blog-icon-base.png"]
```

---

## 📱 動作確認

1. WordPressの投稿・固定ページに上記ショートコードを追加
2. 「プレビュー」または「公開」をクリック
3. ページを表示してアイコンエディターが動作するか確認

**正常に動作する場合：**
- 指定した画像が表示される
- 色・形状・サイズが変更できる
- PNGダウンロードが可能

---

## 🔧 トラブルシューティング

### Q: アイコンエディターが表示されない
**A:** 以下を確認
1. `dist` ファイルが正しい場所にアップロードされているか
2. functions.php のコードが正しく追加されているか
3. 画像URLが正しいか（httpやhttpsも含めて）

### Q: 画像が表示されない
**A:** 画像URLを確認
- 絶対URL（https://から始まる）を使用
- 画像ファイルが実際に存在するか確認
- CORS エラーの場合は同一ドメインの画像を使用

### Q: ダウンロードできない
**A:** ブラウザの設定を確認
- ポップアップブロックが無効になっているか
- JavaScriptが有効になっているか

### Q: スタイルが崩れる
**A:** テーマとの競合
- 他のCSSとの干渉可能性
- 必要に応じてCSSの優先度調整

---

## 🎯 高度な使用方法

### 複数の画像を使い分け

**ページA（企業ロゴ用）：**
```
[icon_editor image="https://yoursite.com/wp-content/uploads/logo.png"]
```

**ページB（アイコン作成用）：**
```
[icon_editor image="https://yoursite.com/wp-content/uploads/icon-base.png"]
```

### 設定のカスタマイズ

```php
// functions.php でデフォルト設定を変更
function custom_icon_editor_shortcode($atts) {
    $atts = shortcode_atts(array(
        'image' => 'https://yoursite.com/wp-content/uploads/default-icon.png', // あなたのデフォルト画像
        'width' => '90%',
        'height' => '650px'
    ), $atts);
    
    // 以下同じ...
}
```

---

## ⚡ パフォーマンス最適化

### 画像最適化
- **推奨サイズ**: 256x256px 正方形
- **ファイル形式**: PNG（透明背景対応）
- **ファイルサイズ**: 100KB以下推奨

### 読み込み速度向上
```php
// 特定のページでのみCSSを読み込み
function load_icon_editor_conditionally() {
    global $post;
    if (isset($post->post_content) && has_shortcode($post->post_content, 'icon_editor')) {
        // CSS読み込みコード
    }
}
add_action('wp_head', 'load_icon_editor_conditionally');
```

---

## 🎉 完成！

**これで完了です！** 

1. **管理者**: ショートコードに画像URLを指定
2. **訪問者**: 直感的にアイコンをカスタマイズ
3. **結果**: 高品質なPNG画像をダウンロード

**メンテナンス**: 画像URLを変更するだけでいつでも更新可能

---

**🔗 サポート**:
- 設定でお困りの場合はお気軽にお声がけください
- カスタマイズのご要望もお聞きします

**更新日**: 2025-08-11  
**対象**: WordPress 5.0以上  
**所要時間**: 5分