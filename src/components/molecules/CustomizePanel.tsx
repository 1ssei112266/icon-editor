import React from 'react';
import { Paper, Stack } from '@mantine/core';
import { ShapeSelector, SizeControl, ColorPalette } from '../atoms';

interface CustomizePanelProps {
  /** 現在の形状 */
  shape: 'circle' | 'square';
  /** 現在のサイズ（%） */
  imageScale: number;
  /** 現在の背景色 */
  bgColor: string;
  /** 形状変更時のコールバック */
  onShapeChange: (shape: 'circle' | 'square') => void;
  /** サイズ変更時のコールバック */
  onSizeChange: (increment: number) => void;
  /** 背景色変更時のコールバック */
  onColorChange: (color: string) => void;
  /** カスタムカラーピッカー開く */
  onOpenCustomPicker: () => void;
}

/**
 * カスタマイズパネルコンポーネント（Molecule）
 * 形状、サイズ、色の調整機能をまとめたパネル
 */
export const CustomizePanel: React.FC<CustomizePanelProps> = ({
  shape,
  imageScale,
  bgColor,
  onShapeChange,
  onSizeChange,
  onColorChange,
  onOpenCustomPicker
}) => {
  const customizePanelStyle = {
    background: '#fef3c7',
    border: '2px solid #fde68a',
  };

  return (
    <Paper p="lg" withBorder radius="xl" shadow="md" style={customizePanelStyle}>
      <Stack gap="md">
        <ShapeSelector 
          shape={shape}
          onShapeChange={onShapeChange}
        />
        
        <SizeControl 
          size={imageScale}
          onSizeChange={onSizeChange}
        />
        
        <ColorPalette 
          bgColor={bgColor}
          onColorChange={onColorChange}
          onOpenCustomPicker={onOpenCustomPicker}
        />
      </Stack>
    </Paper>
  );
};