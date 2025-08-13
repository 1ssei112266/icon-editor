import React from 'react';
import { Button, Group, Stack, Text } from '@mantine/core';
import { SIZE_LIMITS } from '../../constants';

interface SizeControlProps {
  /** 現在のサイズ（%） */
  size: number;
  /** サイズ変更時のコールバック */
  onSizeChange: (increment: number) => void;
}

/**
 * サイズ調整コンポーネント（Atom）
 * サイズを5%刻みで調整可能
 */
export const SizeControl: React.FC<SizeControlProps> = ({
  size,
  onSizeChange
}) => {
  return (
    <Stack gap="xs">
      <Text size="sm" fw={600} c="dark" ta="center">サイズ</Text>
      <Group gap="sm" justify="center" align="center">
        <Button
          variant="light"
          color="blue.7"
          radius="md"
          size="xs"
          onClick={() => onSizeChange(-SIZE_LIMITS.STEP)}
          disabled={size <= SIZE_LIMITS.MIN}
          style={{ fontWeight: 500 }}
        >
          小さく
        </Button>
        <Text size="md" fw={700} c="dark" style={{ minWidth: '50px', textAlign: 'center' }}>
          {size}%
        </Text>
        <Button
          variant="light"
          color="blue.7"
          radius="md"
          size="xs"
          onClick={() => onSizeChange(SIZE_LIMITS.STEP)}
          disabled={size >= SIZE_LIMITS.MAX}
          style={{ fontWeight: 500 }}
        >
          大きく
        </Button>
      </Group>
    </Stack>
  );
};