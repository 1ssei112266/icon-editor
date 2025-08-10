import React, { useRef, useState } from 'react';

/**
 * ImageUploaderコンポーネントのProps型定義
 * 画像アップロード機能と関連する状態管理を担当
 */
interface ImageUploaderProps {
  /** アップロードされた画像のDataURL（base64形式）を受け取るコールバック関数 */
  onImageUpload: (imageDataUrl: string | null) => void;
  /** アップロードエラー時に呼ばれるコールバック関数（オプション） */
  onError?: (errorMessage: string) => void;
  /** 現在アップロードされている画像のファイル名（表示用） */
  currentImageName?: string;
}

/**
 * 画像アップロード・ファイル選択コンポーネント（Atom）
 * 
 * 主な機能:
 * - ファイル選択UI（input type="file"）
 * - 画像ファイルの形式・サイズバリデーション
 * - FileReader APIを使用した画像プレビュー生成
 * - ドラッグ&ドロップ対応（将来拡張用）
 * - エラーハンドリングとユーザーフィードバック
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  onError,
  currentImageName,
}) => {
  // ファイル選択のinput要素への参照
  const fileInputRef = useRef<HTMLInputElement>(null);
  // アップロード処理中の状態管理
  const [isUploading, setIsUploading] = useState(false);

  // 許可する画像形式（MIME type）
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  // 最大ファイルサイズ（5MB）
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  /**
   * ファイル選択時の処理
   * バリデーション → FileReader API → コールバック実行の流れ
   */
  const handleFileSelect = async (file: File) => {
    // ファイル形式の検証
    if (!ALLOWED_TYPES.includes(file.type)) {
      const errorMessage = `対応していないファイル形式です。対応形式: ${ALLOWED_TYPES.map(type => type.split('/')[1]).join(', ')}`;
      onError?.(errorMessage);
      return;
    }

    // ファイルサイズの検証
    if (file.size > MAX_FILE_SIZE) {
      const errorMessage = `ファイルサイズが大きすぎます。最大サイズ: ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`;
      onError?.(errorMessage);
      return;
    }

    setIsUploading(true);

    try {
      // FileReader APIを使用してファイルをDataURL（base64）に変換
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onImageUpload(result); // 親コンポーネントにDataURLを渡す
        setIsUploading(false);
      };

      reader.onerror = () => {
        onError?.('ファイルの読み込みに失敗しました。');
        setIsUploading(false);
      };

      // ファイルをDataURLとして読み込み開始
      reader.readAsDataURL(file);

    } catch {
      onError?.('予期しないエラーが発生しました。');
      setIsUploading(false);
    }
  };

  /**
   * input要素のonChange イベントハンドラ
   * ファイル選択ダイアログからのファイル選択を処理
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * ファイル選択ボタンのクリック処理
   * 隠されたinput要素をプログラムで操作
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * アップロードした画像をクリア（削除）する処理
   * デフォルトのPicsum画像に戻す
   */
  const handleClearImage = () => {
    onImageUpload(null);
    // input要素の値もクリア
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="tw-text-center tw-space-y-4">
      <h3 className="tw-text-lg tw-font-bold">画像選択</h3>
      
      {/* 隠されたファイル選択input - プログラムから操作 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleInputChange}
        className="tw-hidden"
      />
      
      {/* ファイル選択ボタン */}
      <div className="tw-flex tw-justify-center tw-gap-3">
        <button
          onClick={handleButtonClick}
          disabled={isUploading}
          className="tw-px-6 tw-py-3 tw-bg-purple-500 tw-text-white tw-rounded-lg tw-font-bold hover:tw-bg-purple-600 tw-transition-colors tw-shadow-md hover:tw-shadow-lg disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
          title="画像ファイルを選択してアップロード"
        >
          {isUploading ? '📤 アップロード中...' : '📁 画像を選択'}
        </button>
        
        {/* 画像クリアボタン（画像がアップロードされている場合のみ表示） */}
        {currentImageName && (
          <button
            onClick={handleClearImage}
            className="tw-px-4 tw-py-3 tw-bg-gray-500 tw-text-white tw-rounded-lg tw-font-bold hover:tw-bg-gray-600 tw-transition-colors tw-shadow-md hover:tw-shadow-lg"
            title="アップロードした画像をクリア"
          >
            🗑️ クリア
          </button>
        )}
      </div>
      
      {/* 現在の画像情報表示 */}
      <div className="tw-text-sm tw-text-gray-600">
        {currentImageName ? (
          <p>📷 {currentImageName}</p>
        ) : (
          <p>🖼️ デフォルト画像を使用中</p>
        )}
      </div>
      
      {/* ファイル形式・サイズ制限の説明 */}
      <div className="tw-text-xs tw-text-gray-500 tw-bg-gray-50 tw-p-3 tw-rounded">
        <p>📋 対応形式: JPEG, PNG, GIF, WebP</p>
        <p>📏 最大サイズ: {Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB</p>
      </div>
    </div>
  );
};

export default ImageUploader;