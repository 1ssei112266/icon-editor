import React, { useMemo } from 'react';
import { Box, Alert } from '@mantine/core';
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
    // WordPress環境での確実な色変更のため
    ...(isEditing && {
      backgroundColor: `${bgColor} !important`,
      background: `${bgColor} !important`,
      '--tw-bg-opacity': '1',
      '--icon-bg-color': bgColor,
    }),
  }), [bgColor, shape, isEditing]);

  return (
    <Box data-icon-container style={containerStyle}>
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
    </Box>
  );
};