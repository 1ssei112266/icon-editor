# Icon Customizer - WordPress連携 Reactアイコンエディタ

WordPress埋め込み可能な高品質アイコンカスタマイザー。React 19とTailwind CSS 4で構築されたアイコンエディタです。

## 🚀 特徴

### 基本機能
- **ショートコード対応**: `[icon_customizer]` で任意の場所に設置
- **高解像度出力**: 1024px高品質PNG ダウンロード
- **直感的なカスタマイズ**:
  - 形状変更（完全円形・iOS風角丸四角）
  - サイズ調整（50%-200%）
  - 背景色選択

### 技術的特徴
- **React 19 + TypeScript**: 最新技術スタックでの高品質実装
- **レスポンシブ**: モバイル最適化とタッチ操作対応
- **エラーハンドリング**: ローディング状態とエラー通知システム
- **CORS対応**: 外部画像URLサポート
- **WordPress互換性**: SWELLテーマ対応、`tw-` prefixでスタイル競合回避

## 📦 インストール方法

### ステップ1: プラグインファイルをダウンロード

1. このリポジトリから `wordpress-plugin/icon-customizer.zip` をダウンロード

### ステップ2: WordPressにインストール

1. **WordPress管理画面**にログイン
2. **プラグイン** → **新規追加** をクリック
3. **プラグインのアップロード** をクリック
4. `icon-customizer.zip` ファイルを選択
5. **今すぐインストール** をクリック
6. **プラグインを有効化** をクリック

### ステップ3: ショートコードで設置

投稿・固定ページの編集画面で以下を挿入：

```
[icon_customizer]
```

**独自画像を使用する場合：**
```
[icon_customizer image="https://yoursite.com/wp-content/uploads/your-icon.png"]
```

## 📖 使用方法

### 基本的な使い方

1. **プレビュー画面**（初期表示）
   - アイコンの現在の状態を確認
   - **「ダウンロード」**ボタン: 元の透過画像をそのまま保存
   - **「自分好みに編集」**ボタン: 編集画面に移行

2. **カスタマイズ画面**
   - **形状**: 円形（●）または角丸四角（□）を選択
   - **サイズ**: 「小さく」「大きく」ボタンで10%-150%の範囲で調整
   - **背景色**: カラーパレットから選択、または「グラデーション」ボタンでカスタム色
   - **「アイコン画像ダウンロード」**ボタン: カスタマイズ済み画像を保存
   - **「ツールを閉じる」**ボタン: プレビュー画面に戻る

### ショートコードオプション

| 属性 | 説明 | デフォルト値 | 例 |
|------|------|-------------|-----|
| `image` | 使用する画像のURL | プラグイン内蔵画像 | `image="https://example.com/icon.png"` |
| `width` | コンテナの幅 | `100%` | `width="500px"` |
| `height` | コンテナの高さ | `auto` | `height="400px"` |

**使用例：**
```html
[icon_customizer image="https://yoursite.com/custom-icon.png" width="600px"]
```

## 🛠 技術仕様

### フロントエンド
- **React**: 19.1.0 
- **TypeScript**: 5.8.3 
- **UI Framework**: Mantine Core 8.2.4
- **CSS Framework**: Tailwind CSS 4.1.11 (`tw-` prefix)
- **ビルドツール**: Vite 7.0.4
- **Canvas処理**: html2canvas (高解像度PNG出力)

### WordPress連携
- **対応WordPress**: 5.0以上
- **対応PHP**: 7.4以上
- **ライセンス**: GPL v2 or later

### 開発環境
- **ESLint**: 9.30.1 (コード品質)
- **PostCSS**: 8.5.6 + Autoprefixer
- **TypeScript**: 厳密な型チェック

## 📁 プロジェクト構成

### 開発環境
```
icon-editor/
├── src/
│   ├── components/          # Reactコンポーネント（Atomic Design）
│   │   ├── atoms/          # 基本UI要素
│   │   │   ├── IconPreview.tsx    # アイコンプレビュー + PNG ダウンロード
│   │   │   └── ShapeSelector.tsx  # 形状選択（circle/square）
│   │   ├── molecules/      # 組み合わせコンポーネント
│   │   ├── organisms/      # 複合コンポーネント
│   │   └── templates/      # レイアウトテンプレート
│   ├── App.tsx             # メインアプリケーション
│   └── main.tsx            # エントリーポイント
├── public/                 # 静的ファイル
├── package.json           # 依存関係とスクリプト
└── README.md             # プロジェクト説明書
```

### WordPressプラグイン
```
icon-customizer/
├── icon-customizer.php    # メインプラグインファイル
├── readme.txt            # WordPress公式用README
├── assets/
│   ├── index.css         # ビルド済みスタイルシート
│   ├── index.js          # ビルド済みJavaScript
│   └── dummy-icon.png    # デフォルト画像
```

## 🔧 開発・カスタマイズ

### 開発環境セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# 本番用ビルド
npm run build

# コード品質チェック
npm run lint

# プレビュー（ビルド後の確認）
npm run preview
```

### デフォルト画像を変更

プラグインフォルダ内の `assets/dummy-icon.png` を任意の画像に差し替えてください。

### 色パレットをカスタマイズ

プラグインの設定を変更することで、デフォルトの色パレットを変更できます。

### WordPress テーマ互換性

- 必ず `tw-` prefix を使用してスタイル競合を防止
- SWELLテーマでのテスト実施済み
- ショートコード埋め込み時の動作確認必須

## 🐛 トラブルシューティング

### よくある問題

**Q: アイコンが表示されない**
- プラグインが有効化されているか確認
- ショートコードが正しく記述されているか確認
- 画像URLが正しくアクセス可能か確認
- コンソールでCORSエラーがないか確認

**Q: カスタマイズ画面が表示されない**  
- ブラウザのJavaScript実行が有効になっているか確認
- 他のプラグインとの競合がないか確認
- Reactコンポーネントのロード失敗がないか確認

**Q: ダウンロードできない**
- ブラウザのポップアップブロックが無効になっているか確認
- 画像のCORS設定が正しいか確認
- Canvas要素の描画エラーがないか確認

**Q: スタイルが競合する**
- Tailwind CSSの `tw-` prefixが正しく適用されているか確認
- WordPressテーマとのCSS競合を確認
- ブラウザ開発者ツールでスタイル上書きを確認

### サポート

問題が発生した場合は、以下の情報を含めてIssueを作成してください：
- WordPress バージョン
- 使用テーマ
- 他の有効プラグイン一覧
- ブラウザとバージョン
- エラーメッセージ（あれば）

## 📄 ライセンス

GPL v2 or later

## 🤝 コントリビューション

プルリクエストやバグレポートを歓迎します！

## 📝 変更履歴

### v1.0.24 (2025-08-30) - 最新版
- **完全版リリース**: 全フェーズ完了
- React 19.1.0 + TypeScript 5.8.3 へアップデート
- Tailwind CSS 4.1.11 (`tw-` prefix) 完全対応
- Mantine UI 8.2.4 統合
- 高解像度1024px PNG出力対応

### v1.0.7 (2025-08-29)
- React CreateRoot 重複エラー (#299) 修正版
- エラーハンドリングシステム強化
- ローディング状態の改善

### v1.0.6 (2025-08-28)
- クリーンUI対応
- モバイル最適化とタッチ操作改善
- パフォーマンス最適化（useCallback/useMemo）

### Phase 1-3 完了済み機能
- **Phase 1**: 基本機能（プレビュー、ダウンロード、形状・色・サイズ変更）
- **Phase 2**: WordPress REST API連携、ACF対応、フォールバック機能
- **Phase 3**: UX改善、エラーハンドリング、高品質出力、形状品質向上

---

**開発者**: IsseiSuzuki  
**リポジトリ**: https://github.com/1ssei112266/icon-editor  
**技術スタック**: React 19 + TypeScript + Tailwind CSS 4 + Vite 7
