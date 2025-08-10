import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

/**
 * IconPreviewコンポーネントのProps型定義
 * アイコンの表示設定とダウンロード機能のコールバックを受け取る
 */
interface IconPreviewProps {
  /** アイコン画像のURL (外部画像URL対応) */
  imageUrl: string;
  /** アイコンの形状 - circle: 丸形、square: 角丸四角形 */
  shape: "circle" | "square";
  /** アイコンのサイズ (px単位) - 表示サイズとダウンロード画像サイズの両方に適用 */
  size: number;
  /** 背景色 (CSS color値) - HEX、RGB、色名等に対応 */
  backgroundColor: string;
  /** ダウンロード開始時のコールバック関数 (オプション) */
  onDownload?: () => void;
}
/**
 * アイコンプレビューコンポーネント
 * 指定された画像、形状、サイズ、背景色でアイコンを表示し、PNG形式でダウンロード可能
 * 
 * 主な機能:
 * - リアルタイムアイコンプレビュー表示
 * - html2canvasを使用したDOM要素のPNG変換・ダウンロード
 * - CORS対応による外部画像の取り扱い
 * - レスポンシブ対応のUI設計
 */
const IconPreview: React.FC<IconPreviewProps> = ({
  imageUrl,
  shape,
  size,
  backgroundColor,
  onDownload,
}) => {
  // html2canvasでキャプチャするDOM要素への参照
  const iconRef = useRef<HTMLDivElement>(null);

  // 形状に応じてTailwind CSSクラスを動的に決定
  // circle: 完全な円形、square: 角丸四角形
  const shapeClasses = shape === "circle" ? "tw-rounded-full" : "tw-rounded-lg";

  /**
   * PNG画像ダウンロード機能
   * html2canvasを使用してDOM要素をCanvas要素に変換し、PNG形式でダウンロード
   * 
   * 処理フロー:
   * 1. DOM要素の存在確認
   * 2. onDownloadコールバック実行（親コンポーネントへの通知）
   * 3. html2canvasでDOM要素をCanvas化
   * 4. CanvasをPNG DataURLに変換
   * 5. ダウンロード用のaタグを動的作成・実行
   */
  const downloadAsPng = async () => {
    // DOM要素の存在確認 - useRefで参照したiconRef.currentがnullの場合は処理終了
    if (!iconRef.current) return;
    
    try {
      // 親コンポーネントにダウンロード開始を通知（ログ出力等で使用）
      onDownload?.();
      
      // html2canvasでDOM要素をCanvas要素に変換
      // useCORS: true - 外部ドメインの画像を取得可能にする
      // allowTaint: true - CORS制限を緩和（ただしcanvas汚染を許可）
      const canvas = await html2canvas(iconRef.current, {
        useCORS: true,
        allowTaint: true,
      });
      
      // Canvas要素をPNG形式のDataURLに変換してダウンロード実行
      const link = document.createElement('a');
      link.download = `icon-${Date.now()}.png`; // タイムスタンプ付きファイル名で重複回避
      link.href = canvas.toDataURL('image/png'); // PNG形式のDataURL生成
      link.click(); // ダウンロード実行
      
    } catch (error) {
      // エラーハンドリング - コンソール出力とユーザー通知
      console.error('PNG ダウンロードエラー:', error);
      alert('ダウンロードに失敗しました。ネットワーク接続またはCORS設定をご確認ください。');
    }
  };

  return (
    <div className="tw-text-center tw-space-y-4">
      {/* アイコンプレビュー表示エリア - html2canvasでキャプチャされる範囲 */}
      <div
        ref={iconRef} // html2canvasでキャプチャするDOM要素の参照
        className={`tw-inline-block tw-overflow-hidden tw-border-4 tw-border-blue-500 ${shapeClasses}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor, // 動的な背景色の適用
        }}
      >
        {/* アイコン画像 - object-coverで縦横比を保持しつつ領域を埋める */}
        <img
          src={imageUrl}
          alt="Icon preview"
          className="tw-w-full tw-h-full tw-object-cover"
          crossOrigin="anonymous" // CORS対応のため明示的に設定
        />
      </div>
      
      {/* PNG ダウンロードボタン */}
      <button
        onClick={downloadAsPng}
        className="tw-px-6 tw-py-3 tw-bg-green-500 tw-text-white tw-rounded-lg tw-font-bold hover:tw-bg-green-600 tw-transition-colors tw-shadow-md hover:tw-shadow-lg"
        title="現在のアイコンをPNG形式でダウンロード"
      >
        📥 PNG ダウンロード
      </button>
    </div>
  );
};

export default IconPreview;
