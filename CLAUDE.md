# Claude Code プロジェクト設定

このファイルは Claude Code 用のプロジェクト設定とコンテキストを記載しています。

## プロジェクト概要

**WordPress連携 React アイコンカスタマイザー**

- WordPressサイトに埋め込み可能なアイコンエディタ
- React 18 + Vite + Tailwind CSS（`tw-` prefix）
- SWELLテーマとの互換性を重視
- ショートコード `[icon_customizer]` での埋め込み対応

## 開発コマンド

### 基本コマンド
```bash
# 開発サーバー起動
npm run dev

# 本番用ビルド
npm run build

# コード品質チェック
npm run lint

# プレビュー（ビルド後の確認）
npm run preview
```

### 開発ワークフロー
1. 新機能開発時は必ずブランチを切る
2. 一機能完了ごとにコミット作成
3. lint と build を実行してエラーがないことを確認
4. 詳細なコミットメッセージでプルリク準備

## プロジェクト構造

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

## 実装済み機能

### ✅ 完了
- **IconPreview コンポーネント**: 画像プレビューとPNGダウンロード
- **ShapeSelector コンポーネント**: circle/square 形状選択
- **サイズ調整機能**: 60px-300px の範囲でリアルタイム調整
- **背景色変更**: カラーピッカーでの色選択
- **PNG ダウンロード**: html2canvas による高品質画像出力
- **CORS対応**: 外部画像URL対応

### ✅ Phase 2完了済み
- **WordPress REST API連携**: Advanced Custom Fields活用
- **初心者向け実装**: プログラミング不要の管理画面設定
- **自動フォールバック**: API接続失敗時はデモモード
- **完全ドキュメント化**: 管理者・開発者向けガイド完成

### 🔄 Phase 3開発予定
- **UX改善**: エラーハンドリング強化
- **モバイル最適化**: スマホでの操作性向上
- **パフォーマンス向上**: 読み込み速度改善
- **アクセシビリティ対応**: 全ユーザーが使いやすく

## 技術仕様

### 依存関係
- **React 19**: UIライブラリ
- **Vite**: 開発サーバー・ビルドツール
- **Tailwind CSS 4**: スタイリング（`tw-` prefix）
- **html2canvas**: DOM → PNG 変換
- **TypeScript**: 型安全性

### コーディング規約
- **言語**: TypeScript推奨、JavaScript可
- **コメント**: 日本語で詳細に記載
- **CSS**: Tailwind CSS の `tw-` prefix 必須
- **ファイル名**: PascalCase（コンポーネント）
- **関数名**: camelCase
- **型定義**: インターフェース名は Props サフィックス

### ブランチ戦略
- `main`: 安定版
- `feature/*`: 新機能開発
- `fix/*`: バグ修正
- `docs/*`: ドキュメント更新

## 注意事項

### WordPress テーマ互換性
- 必ず `tw-` prefix を使用してスタイル競合を防ぐ
- SWELLテーマでのテスト実施済み
- ショートコード埋め込み時の動作確認必須

### CORS とセキュリティ
- 外部画像取得時はCORS対応必須
- `html2canvas` の `useCORS: true` 設定
- セキュリティ上、信頼できる画像URLのみ使用推奨

### パフォーマンス
- 画像サイズは最大300px制限
- ダウンロード時の高解像度出力対応
- 大きな画像処理時はローディング表示検討

## デバッグ・トラブルシューティング

### よくある問題
1. **CORS エラー**: 画像URLのドメインでCORS許可設定確認
2. **ダウンロード失敗**: ブラウザのポップアップブロック設定確認
3. **Tailwind 競合**: `tw-` prefix の記載漏れ確認
4. **TypeScript エラー**: `npm run build` で型エラー確認

### ログ確認
- ダウンロード開始: コンソールログで設定値確認
- エラー時: 詳細なエラーメッセージをコンソール出力
- 本番環境: エラー境界での適切なフォールバック

## 今後の拡張

### Phase 1 ✅ (完了済み)
- [x] 基本機能実装（管理人画像選択・PNGダウンロード）
- [x] UI/UX基盤構築
- [x] レスポンシブ対応

### Phase 2 ✅ (完了済み) 
- [x] WordPress REST API連携
- [x] Advanced Custom Fields活用
- [x] 初心者向け完全ガイド作成
- [x] 自動フォールバック機能

### Phase 3 🔮 (今後予定)
- [ ] UX改善（エラーハンドリング・ローディング）
- [ ] モバイル最適化
- [ ] アクセシビリティ対応
- [ ] パフォーマンス向上

---

**更新日**: 2025-08-10
**Claude Code Version**: Sonnet 4
**メンテナー**: プロジェクト開発チーム