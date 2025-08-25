=== Icon Customizer ===
Contributors: IsseiSuzuki
Tags: icon, customizer, image, editor, shortcode
Requires at least: 5.0
Tested up to: 6.3
Stable tag: 1.0.22
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

WordPress埋め込み可能なアイコンカスタマイザー。ユーザーがアイコンの形状、サイズ、背景色を自由にカスタマイズできます。

== Description ==

Icon Customizerは、WordPressサイトに簡単に埋め込めるアイコンエディタープラグインです。

**主な機能:**
* アイコンの形状変更（円形・角丸四角）
* サイズ調整（10%-150%）
* 背景色のカスタマイズ
* 元画像とカスタマイズ済み画像の両方をダウンロード可能
* モバイル対応のレスポンシブデザイン
* ショートコード `[icon_customizer]` で簡単埋め込み

**使用技術:**
* React 19
* Vite
* Mantine UI
* TypeScript

== Installation ==

1. プラグインファイルをアップロードし、有効化します
2. 投稿や固定ページで `[icon_customizer]` ショートコードを使用します
3. オプション: `[icon_customizer image="画像URL"]` で独自画像を指定できます

== Frequently Asked Questions ==

= どのようにカスタム画像を使用しますか？ =

ショートコードで画像URLを指定してください：
`[icon_customizer image="https://yoursite.com/path/to/image.png"]`

= モバイルデバイスで動作しますか？ =

はい、完全にレスポンシブ対応しており、モバイルデバイスでも快適に使用できます。

== Screenshots ==

1. プレビュー画面
2. カスタマイズ画面
3. 色選択画面

== Changelog ==

= 1.0.22 =
* 🗑️ 問題のあった虹色カスタムカラーボタンを削除
* 🎯 カスタマイズダウンロード機能を完全修正
* 📦 Canvas APIによる高品質1024px PNG生成
* ✅ 形状・サイズ・色の設定を正確にダウンロード画像に反映

= 1.0.21 =
* 🌈 ローカル版と完全同一の虹色カスタムカラーボタン追加
* 🎨 ローカル版と同じ色パレット（9色プリセット）に統一
* ✨ 虹色ボタンクリックでシステムカラーピッカー起動
* 🎯 ローカル版とWordPress版のUI・機能を完全一致

= 1.0.20 =
* 🎨 豊富な色選択機能を復活：9色プリセットパレット
* 🌈 カスタムカラーピッカー追加：自由な色選択が可能
* ✨ 元のReact版と同等の色カスタマイズ機能を実現
* 📱 すべてHTML+JavaScriptで軽量動作

= 1.0.19 =
* 🎯 React依存完全排除：純粋HTML+JavaScript実装に変更
* ✅ WordPress環境での色変更問題を根本解決
* 🚀 軽量化とパフォーマンス向上
* 🔧 テーマ競合問題を完全回避
* 📱 全機能維持：形状・サイズ・色のカスタマイズ、ダウンロード対応

= 1.0.18 =
* 💪 最強CSS適用：動的style要素注入でWordPressテーマを完全に上書き
* 🔥 !important宣言でCSS優先度を最高レベルに設定
* 🎯 WordPress環境での色変更を確実に動作させる決定版
* 🧪 テストで確認：React state更新は正常、CSS適用のみの問題を解決

= 1.0.17 =
* 🎉 根本原因解決：WordPress環境でのprocess変数エラーを修正
* 🔧 Vite設定でNode.js変数をブラウザ互換に定義
* ✅ 色変更機能が完全に動作するように修正
* 🐛 「process is not defined」エラーを解消

= 1.0.16 =
* 🔧 WordPress環境での色変更問題を根本解決：backgroundColorからbackgroundプロパティに変更
* 🎯 CSS競合回避：WordPressテーマのbackgroundColor上書きを無効化
* MantineのBoxコンポーネントから素のdiv要素に変更してCSS優先度問題を解決

= 1.0.15 =
* 🖼️ 初期画面のアイコンプレビュー表示を復活
* 🎨 色選択機能の安定性向上：背景色の二重設定で確実な変更
* WordPress環境での表示問題とカスタマイズ機能の両方を解決

= 1.0.14 =
* 🔧 アセット読み込み条件を簡素化：フロントエンドで常時読み込み
* ショートコード検出エラーによる表示問題を解決
* WordPress環境での確実な動作保証

= 1.0.13 =
* 🐛 色選択機能の修正：WordPress環境でのCSS競合問題を解決
* !important宣言とCSS変数による確実な背景色適用
* SWELLテーマとの互換性向上

= 1.0.12 =
* 🎨 カスタマイズ開始時の初期色を白に変更
* 🐛 色選択機能のデバッグログ追加
* 色変更の動作確認機能強化

= 1.0.11 =
* 🗑️ フロントエンド表示要素完全削除
* 青い円・市松模様・アイコン画像を非表示化
* UIを最小限のボタンのみに変更

= 1.0.9 =
* 🧹 エディタープレビューUI完全整理
* preview-header要素削除
* 不要な空白要素削除

= 1.0.8 =
* 🎨 エディター内デバッグメッセージ削除
* フロントエンドUI整理

= 1.0.7 =
* 🔧 React Error #299 完全修正: createRoot重複実行防止
* プレビュー画面削除
* UIデバッグログ要素を削除

= 1.0.6 =
* 📦 WordPress プラグイン クリーンUI対応
* 🎨 MantineベースCSS問題を完全解決

= 1.0.0 =
* 初回リリース
* 基本的なアイコンカスタマイズ機能
* ショートコード対応
* モバイル対応

== Upgrade Notice ==

= 1.0.0 =
初回リリースです。