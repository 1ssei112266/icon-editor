import React from 'react';
import { Button, Group, Stack, Text } from '@mantine/core';

interface ShapeSelectorProps {
  /** 現在選択されている形状 */
  shape: 'circle' | 'square';
  /** 形状変更時のコールバック */
  onShapeChange: (shape: 'circle' | 'square') => void;
}

/**
 * 形状選択コンポーネント（Atom）
 * circle（円形）またはsquare（角丸四角）を選択
 */
export const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  shape,
  onShapeChange
}) => {
  return (
    <Stack gap="xs">
      <Text size="sm" fw={600} c="dark" ta="center">形状</Text>
      <Group gap="sm" justify="center">
        {(['circle', 'square'] as const).map((shapeOption) => (
          <Button
            key={shapeOption}
            variant={shape === shapeOption ? 'filled' : 'light'}
            color={shape === shapeOption ? 'blue' : 'gray'}
            radius="lg"
            size="sm"
            onClick={() => onShapeChange(shapeOption)}
            style={{
              fontWeight: 500,
              border: '2px solid',
              borderColor: shape === shapeOption ? '#3b82f6' : '#d1d5db',
            }}
          >
            {shapeOption === 'circle' ? 'まる●' : '□しかく'}
          </Button>
        ))}
      </Group>
    </Stack>
  );
};