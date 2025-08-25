import React from 'react';
import { Box, Group, Stack, Text } from '@mantine/core';
import { COLOR_SWATCHES } from '../../constants';

interface ColorPaletteProps {
  /** 現在選択されている背景色 */
  bgColor: string;
  /** 背景色変更時のコールバック */
  onColorChange: (color: string) => void;
  /** カスタムカラーピッカー開く */
  onOpenCustomPicker: () => void;
}

/**
 * カラーパレットコンポーネント（Atom）
 * プリセット色の選択とカスタムカラーピッカーへのアクセス
 */
export const ColorPalette: React.FC<ColorPaletteProps> = ({
  bgColor,
  onColorChange,
  onOpenCustomPicker
}) => {
  return (
    <Stack gap="xs">
      <Text size="sm" fw={600} c="dark" ta="center">背景色</Text>
      <Group gap="xs" justify="center">
        {COLOR_SWATCHES.map((swatch, index) => (
          <Box
            key={index}
            style={{
              width: 28,
              height: 28,
              backgroundColor: swatch.color,
              borderRadius: '50%',
              border: `3px solid ${bgColor === swatch.color ? '#374151' : 
                swatch.color === '#ffffff' ? '#9ca3af' : 'white'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              console.log('色選択:', swatch.color);
              onColorChange(swatch.color);
            }}
            onMouseEnter={(e) => {
              if (bgColor !== swatch.color) {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        ))}
        
        {/* カスタムカラーボタン */}
        <Box
          style={{
            width: 28,
            height: 28,
            background: 'linear-gradient(45deg, #ff0000, #ff8800, #ffff00, #88ff00, #00ff00, #00ff88, #00ffff, #0088ff, #0000ff, #8800ff, #ff00ff, #ff0088)',
            borderRadius: '50%',
            border: `3px solid ${!COLOR_SWATCHES.find(s => s.color === bgColor) ? 'white' : '#374151'}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={onOpenCustomPicker}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </Group>
    </Stack>
  );
};