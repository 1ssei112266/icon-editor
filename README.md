# Icon Customizer

## はじめに
WordPressサイトに埋め込める直感的なアイコン編集Webアプリを開発しました。ブランドやサービスロゴをその場でカスタマイズし、1024pxの高解像度PNGとしてダウンロードできます。  
ショートコード1つで導入できるため、ノーコード運用チームでも簡単に扱えるツールです。

## コンセプト

🎯 **コンテンツ編集者に寄り添うツール**  
WordPressの投稿画面から離れずに、ロゴの形・サイズ・背景色を調整してそのままDLできる体験を提供します。

🎨 **ミニマルでわかりやすいUI**  
レスポンシブで余白の多いレイアウト、Mantine UI + Tailwind 4 (`tw-` prefix) を活かした落ち着いた配色で、操作迷いを最小化。

💡 **安心して使えるダウンロード体験**  
Canvas APIでノイズのない1024px PNGを生成。CORSハンドリング、通知トースト、ローディング制御など実務向けの細部を整備しました。

## 概要

### 🏗️ 技術スタック
- フロントエンド: React 19.1 + TypeScript 5.8 + Vite 7
- UI: Mantine Core 8.2 / Tailwind CSS 4 (`tw-` prefix)
- 状態管理: React Hooks（`useMemo` / `useCallback` / `useEffect`）
- ビルド成果物: WordPressプラグインへ同梱

### ✨ 主要機能
- 形状切替：円形 or 角丸四角
- サイズ調整：10%〜150%（5%刻み）
- 背景色：プリセット9色 + カラーピッカー
- 1024px PNGダウンロード（ファイル名自動付与）
- `instanceConfig` or `window.ICON_EDITOR_CONFIG` 経由で画像URL注入
- ショートコード `[icon_customizer image="..."]` を設置するだけのWP統合

## Demoイメージ

📱 **実際の画面構成**

1. **プレビューセクション**  
   - 余白の多いカラーブロック上にアイコンを配置  
   - 「ダウンロード」「自分好みに編集」ボタンで導線を明確化  
   - Demo: [`hero.mov`](public/hero.mov)

2. **カスタマイズパネル**  
   - 形状 / サイズ / 背景色のコントロールを縦に配置し、モバイルでは段組を自動切替  
   - Mantine `ColorPicker` + プリセットカラーchips  
   - Demo: [`customize.mov`](public/customize.mov)

3. **通知 / エラー表示**  
   - Mantine `Alert` を利用し、成功・失敗を3秒表示  
   - Canvas処理で例外発生時にリトライ案内を表示

## UI/UXの特徴
- **ニュートラルな色調**：ライトグレー基調 + ポップなアクセントカラー
- **クリックターゲットを明示**：ボタンやチップに影とホバーを付与
- **レスポンシブ**：768px以下で縦並びに自動切替
- **アクセシビリティ**：WCAGを意識したコントラストと文字サイズ

## 環境

### 💻 開発環境
- Node.js: 20.x 推奨（18 でも可）
- npm: 10.x 以上
- OS: macOS / Windows / Linux

### 📦 主要依存関係
```json
{
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "@mantine/core": "8.2.4",
  "tailwindcss": "4.1.11",
  "typescript": "5.8.3",
  "vite": "7.0.4"
}
```

### 🚀 推奨デプロイ
- Reactアプリ: Vercel / Netlify / Cloudflare Pages（`dist/` を配信）
- WordPressプラグイン: 既存WP環境へ `icon-customizer.zip` をアップロード

## 利用方法

### 🔧 セットアップ
```bash
# 1. リポジトリをクローン
git clone https://github.com/1ssei112266/icon-editor.git

# 2. ディレクトリへ移動
cd icon-editor

# 3. 依存関係をインストール
npm install

# 4. 開発サーバー起動
npm run dev
```

### 📋 開発コマンド
```bash
npm run dev      # Vite開発サーバー (http://localhost:5173)
npm run build    # TypeScriptビルド + Vite本番ビルド
npm run preview  # distのプレビュー
npm run lint     # ESLint
```

### 🌐 WordPressへの導入
1. `wordpress-plugin/icon-customizer` をZIP化（または付属ZIPを使用）
2. WP管理画面 > プラグイン > 新規追加 > アップロードでZIPをインストール
3. `[icon_customizer image="https://example.com/icon.png" width="500px"]` のようにショートコードを挿入
4. `image` にCORS許可済みの画像URLを渡すと、その画像でカスタマイズできます

## プロジェクト構造

```
icon-editor/
├── src/
│   ├── components/
│   │   ├── atoms/        # ShapeSelector, SizeControl, ColorPalette など
│   │   └── molecules/    # IconPreview, CustomizePanel, DownloadButton
│   ├── hooks/useIconDownload.ts
│   ├── utils/canvas.ts
│   ├── constants/index.ts
│   ├── App.tsx / main.tsx
├── public/
├── wordpress-plugin/
│   └── icon-customizer/
│       ├── icon-customizer.php
│       ├── readme.txt
│       └── assets/       # index.js / index.css / dummy-icon.png など
├── package.json / vite.config.ts / tailwind.config.js / eslint.config.js
└── README.md
```

## 実装予定の機能

### 🚀 短期目標（1-2ヶ月）
- 背景グラデーション / 影などのスタイルプリセット追加
- ダウンロード履歴ログ（WordPress管理画面で参照）
- 透過PNGのままアップロードされた場合のガイド表示

### 🎯 中期目標（3-6ヶ月）
- 複数アイコンの一括変換とZIPダウンロード
- WordPress REST API 連携で投稿ごとの既定アイコンを自動取得
- ACF / Gutenberg ブロック対応でのUI統合
- 利用分析（どのプリセットが多いかなど）ダッシュボード

## ライセンス / コントリビューション
- ライセンス: GPL v2 or later
- Issue / PR 歓迎です。再現手順・環境情報・スクリーンショットを添えてください。
- 開発者: IsseiSuzuki — https://github.com/1ssei112266/icon-editor
