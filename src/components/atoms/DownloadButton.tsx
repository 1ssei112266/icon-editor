import React from 'react';
import { Button, Loader } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

interface DownloadButtonProps {
  /** ダウンロード処理中かどうか */
  isDownloading: boolean;
  /** 画像エラーがあるかどうか */
  hasError: boolean;
  /** ダウンロード実行時のコールバック */
  onDownload: () => void;
}

/**
 * ダウンロードボタンコンポーネント（Atom）
 * アイコンのPNG形式ダウンロード機能
 */
export const DownloadButton: React.FC<DownloadButtonProps> = ({
  isDownloading,
  hasError,
  onDownload
}) => {
  return (
    <Button 
      leftSection={isDownloading ? <Loader size={20} color="white" /> : <IconDownload size={20} />}
      size="lg" 
      radius="xl"
      variant="filled"
      onClick={onDownload}
      loading={isDownloading}
      disabled={isDownloading || hasError}
      style={{
        backgroundColor: "#f8bbd9",
        fontSize: '1.1rem',
        padding: '12px 24px',
        fontWeight: 600,
        color: "white"
      }}
    >
      {isDownloading ? 'ダウンロード中...' : 'アイコン画像ダウンロード'}
    </Button>
  );
};