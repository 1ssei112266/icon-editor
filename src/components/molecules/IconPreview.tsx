import React, { useMemo } from 'react';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { CONTAINER_SIZE } from '../../constants';

interface IconPreviewProps {
  /** 表示する画像のURL */
  imageUrl: string;
  /** アイコンの形状 */
  shape: 'circle' | 'square';
  /** 画像のスケール（%） */
  imageScale: number;
  /** 背景色 */
  bgColor: string;
  /** 編集モードかどうか */
  isEditing: boolean;
  /** 画像エラーがあるかどうか */
  hasImageError?: boolean;
}

/**
 * アイコンプレビューコンポーネント（Molecule）
 * 設定に基づいてアイコンを表示
 */
export const IconPreview: React.FC<IconPreviewProps> = ({
  imageUrl,
  shape,
  imageScale,
  bgColor,
  isEditing,
  hasImageError = false
}) => {
  /** 実際の画像サイズ（ピクセル値）（メモ化） */
  const imageSize = useMemo(() => Math.round((CONTAINER_SIZE * imageScale) / 100), [imageScale]);

  /** アイコンコンテナのスタイル（初期 / 編集時で異なる）（メモ化） */
  const containerStyle = useMemo(() => ({
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    backgroundColor: isEditing ? bgColor : 'transparent',
    borderRadius: isEditing && shape === 'circle' ? '50%' : '16px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    boxShadow: isEditing ? '0 10px 20px rgba(0,0,0,0.15)' : 'none',
    border: isEditing ? '3px solid white' : 'none',
    transition: 'all 0.3s ease',
    overflow: 'hidden' as const,
  }), [bgColor, shape, isEditing]);

  // WordPress環境でのCSS強制適用用のstyle要素を作成
  React.useEffect(() => {
    if (isEditing) {
      // 動的にCSSを注入してWordPressテーマを上書き
      const styleId = 'icon-preview-force-style';
      let existingStyle = document.getElementById(styleId);
      
      if (!existingStyle) {
        existingStyle = document.createElement('style');
        existingStyle.id = styleId;
        document.head.appendChild(existingStyle);
      }
      
      existingStyle.textContent = `
        [data-icon-container] {
          background-color: ${bgColor} !important;
          background: ${bgColor} !important;
        }
        .icon-preview-container {
          background-color: ${bgColor} !important;
          background: ${bgColor} !important;
        }
      `;
      
      console.log('🎨 CSS強制適用:', bgColor);
    }
  }, [bgColor, isEditing]);

  return (
    <div 
      data-icon-container 
      style={{
        ...containerStyle,
        backgroundColor: isEditing ? bgColor : 'transparent',
        background: isEditing ? bgColor : 'transparent',
      }}
      className="icon-preview-container"
    >
      {hasImageError ? (
        <Alert 
          icon={<IconAlertCircle size="1rem" />} 
          title="画像読み込みエラー" 
          color="orange"
          style={{ 
            width: imageSize, 
            height: imageSize, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          画像を読み込めません
        </Alert>
      ) : (
        <img
          src={imageUrl}
          alt="アイコン画像"
          style={{
            width: imageSize,
            height: imageSize,
            objectFit: 'cover',
            borderRadius: '0px',
            transition: 'all 0.3s ease'
          }}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
};