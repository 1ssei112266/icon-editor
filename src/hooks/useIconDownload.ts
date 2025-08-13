import { useCallback } from 'react';
import { DOWNLOAD_SIZE } from '../constants';
import { drawRoundedRect } from '../utils/canvas';

interface UseIconDownloadProps {
  shape: 'circle' | 'square';
  imageScale: number;
  bgColor: string;
  baseImageUrl: string;
  showNotification: (type: 'success' | 'error', message: string) => void;
}

export const useIconDownload = ({
  shape,
  imageScale,
  bgColor,
  baseImageUrl,
  showNotification
}: UseIconDownloadProps) => {
  const downloadIcon = useCallback(async () => {
    console.log('ダウンロード開始:', { shape, imageScale, bgColor, baseImageUrl });
    
    try {
      const iconContainer = document.querySelector('[data-icon-container]') as HTMLElement;
      if (!iconContainer) {
        throw new Error('アイコンコンテナが見つかりません');
      }

      // 新しい画像をCORS対応で読み込み
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // 画像読み込み完了を待機
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('画像読み込みに失敗しました'));
        // タイムアウト設定（10秒）
        setTimeout(() => reject(new Error('画像読み込みタイムアウト')), 10000);
        img.src = baseImageUrl;
      });

      // 直接Canvas APIを使用して画像を描画
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context取得に失敗しました');
      }

      // 高解像度キャンバスサイズを設定
      canvas.width = DOWNLOAD_SIZE;
      canvas.height = DOWNLOAD_SIZE;

      // 高解像度用の画像サイズ計算
      const downloadImageSize = Math.round((DOWNLOAD_SIZE * imageScale) / 100);

      // 形状に応じて描画処理を分岐
      if (shape === 'circle') {
        // まる（円形）の場合
        ctx.beginPath();
        ctx.arc(DOWNLOAD_SIZE / 2, DOWNLOAD_SIZE / 2, DOWNLOAD_SIZE / 2, 0, Math.PI * 2);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.clip();
        
        // 画像を描画
        const imgX = (DOWNLOAD_SIZE - downloadImageSize) / 2;
        const imgY = (DOWNLOAD_SIZE - downloadImageSize) / 2;
        ctx.drawImage(img, imgX, imgY, downloadImageSize, downloadImageSize);
      } else {
        // 角丸四角の場合
        const borderRadius = DOWNLOAD_SIZE * 0.1; // 10%の角丸
        
        // 角丸四角形を描画して塗りつぶし
        drawRoundedRect(ctx, 0, 0, DOWNLOAD_SIZE, DOWNLOAD_SIZE, borderRadius);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.clip();
        
        // 画像を描画
        const imgX = (DOWNLOAD_SIZE - downloadImageSize) / 2;
        const imgY = (DOWNLOAD_SIZE - downloadImageSize) / 2;
        ctx.drawImage(img, imgX, imgY, downloadImageSize, downloadImageSize);
      }

      // ダウンロード実行
      const link = document.createElement('a');
      link.download = `custom-icon-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('ダウンロード完了');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ダウンロードに失敗しました';
      showNotification('error', errorMessage);
      console.error('ダウンロードエラー:', error);
    }
  }, [shape, imageScale, bgColor, baseImageUrl, showNotification]);

  return { downloadIcon };
};