import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '@mantine/core/styles.css';
import {
  MantineProvider,
  Container,
  Title,
  Stack,
  Button,
  Paper,
  Center,
  Box,
  ActionIcon,
  Transition,
  ColorPicker,
  Alert,
  Group,
} from '@mantine/core';
import { IconX, IconAlertCircle, IconCheck } from '@tabler/icons-react';

// コンポーネントとフック
import { IconPreview, CustomizePanel, DownloadButton } from './components';
import { useIconDownload } from './hooks/useIconDownload';

// 定数とユーティリティ
import { SIZE_LIMITS, MOBILE_BREAKPOINT } from './constants';

// =============================================================================
// スタイル定義
// =============================================================================

/** アプリケーション全体の背景スタイル */
const appBackgroundStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative' as const,
  overflow: 'hidden' as const,
};

/** プレビューエリアの背景スタイル（レスポンシブ） */
const getPreviewAreaStyle = (isMobile: boolean) => ({
  minWidth: isMobile ? 300 : 400,
  minHeight: isMobile ? 300 : 400,
  background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
  display: 'flex',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
});

// =============================================================================
// メインコンポーネント
// =============================================================================

function App() {
  // ---------------------------------------------------------------------------
  // 状態管理
  // ---------------------------------------------------------------------------
  
  /** アイコンの形状（circle または square） */
  const [shape, setShape] = useState<'circle' | 'square'>('circle');
  
  /** 画像のスケール（10-150%） */
  const [imageScale, setImageScale] = useState<number>(80);
  
  /** 背景色（HEX形式） */
  const [bgColor, setBgColor] = useState<string>('#60a5fa');
  
  /** カスタマイズモードの状態 */
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  
  /** カラーピッカーの表示状態 */
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  
  /** モバイル表示かどうかの判定 */
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= MOBILE_BREAKPOINT);
  
  /** ダウンロード処理中の状態 */
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  
  /** 画像読み込みエラーの状態 */
  const [imageError] = useState<boolean>(false);
  
  /** 通知メッセージの状態 */
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // ---------------------------------------------------------------------------
  // エフェクト - リサイズイベントリスナー
  // ---------------------------------------------------------------------------
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ---------------------------------------------------------------------------
  // 通知表示ヘルパー
  // ---------------------------------------------------------------------------
  
  /** 通知を表示する（メモ化） */
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  // ---------------------------------------------------------------------------
  // 計算値
  // ---------------------------------------------------------------------------
  
  /** WordPress ショートコードから画像URLを取得（フォールバック付き）（メモ化） */
  const baseImageUrl = useMemo(() => 
    (window as { ICON_EDITOR_CONFIG?: { baseImageUrl: string } }).ICON_EDITOR_CONFIG?.baseImageUrl 
    || '/dummy-icon.png'
  , []);

  // ---------------------------------------------------------------------------
  // イベントハンドラー
  // ---------------------------------------------------------------------------
  
  /** サイズ調整ハンドラー（メモ化） */
  const handleSizeChange = useCallback((increment: number) => {
    setImageScale(prev => 
      Math.max(SIZE_LIMITS.MIN, Math.min(SIZE_LIMITS.MAX, prev + increment))
    );
  }, []);

  /** ダウンロード機能フック */
  const { downloadIcon } = useIconDownload({
    shape,
    imageScale,
    bgColor,
    baseImageUrl,
    showNotification
  });

  /** ダウンロード処理のラッパー */
  const handleDownload = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadIcon();
    } finally {
      setIsDownloading(false);
    }
  }, [downloadIcon, isDownloading]);

  // ---------------------------------------------------------------------------
  // レンダリング用ヘルパー
  // ---------------------------------------------------------------------------
  
  /** レスポンシブレイアウト用スタイル（メモ化） */
  const getResponsiveLayoutStyle = useMemo((): React.CSSProperties => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: isMobile ? '1.5rem' : '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  }), [isMobile]);

  // ---------------------------------------------------------------------------
  // JSX レンダリング
  // ---------------------------------------------------------------------------
  
  return (
    <MantineProvider>
      <Box style={appBackgroundStyle}>
        <Container size="xl" py="xl" style={{ minHeight: '100vh' }}>
          
          {/* ===== 初期状態：中央表示モード ===== */}
          {!isCustomizing ? (
            <Center style={{ minHeight: 'calc(100vh - 160px)' }}>
              <Stack align="center" gap="xl">
                {/* メインプレビューエリア */}
                <Box style={{ position: 'relative' }}>
                  <Paper p="xl" withBorder radius="xl" shadow="xl" style={getPreviewAreaStyle(isMobile)}>
                    <IconPreview 
                      imageUrl={baseImageUrl}
                      shape={shape}
                      imageScale={imageScale}
                      bgColor={bgColor}
                      isEditing={false}
                      hasImageError={imageError}
                    />
                  </Paper>

                  {/* カスタマイズ開始ボタン（4色パレット風） */}
                  <Box
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: 10,
                    }}
                    onClick={() => setIsCustomizing(true)}
                    onMouseEnter={(e) => !isMobile && (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => !isMobile && (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Box
                      style={{
                        width: isMobile ? 50 : 44,
                        height: isMobile ? 50 : 44,
                        backgroundColor: 'rgba(240, 240, 240, 0.9)',
                        borderRadius: '10px',
                        border: '1px solid rgba(224, 224, 224, 0.8)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridTemplateRows: '1fr 1fr',
                        gap: isMobile ? '4px' : '3px',
                        padding: isMobile ? '6px' : '5px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <Box style={{ backgroundColor: '#ff6b6b', borderRadius: '50%', width: isMobile ? '12px' : '10px', height: isMobile ? '12px' : '10px' }} />
                      <Box style={{ backgroundColor: '#4ecdc4', borderRadius: '50%', width: isMobile ? '12px' : '10px', height: isMobile ? '12px' : '10px' }} />
                      <Box style={{ backgroundColor: '#45b7d1', borderRadius: '50%', width: isMobile ? '12px' : '10px', height: isMobile ? '12px' : '10px' }} />
                      <Box style={{ backgroundColor: '#f9ca24', borderRadius: '50%', width: isMobile ? '12px' : '10px', height: isMobile ? '12px' : '10px' }} />
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Center>
          ) : (
            
            /* ===== 編集モード：分離レイアウト ===== */
            <Box style={{ minHeight: 'calc(100vh - 160px)', padding: '20px 0' }}>
              <Box style={getResponsiveLayoutStyle}>
                
                {/* 左側/上部：プレビューエリア */}
                <Box style={{ 
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  minWidth: isMobile ? '100%' : '400px',
                  maxWidth: isMobile ? '100%' : '50%'
                }}>
                  <Title order={2} c="white" size={isMobile ? "1.5rem" : "2rem"}>プレビュー</Title>
                  
                  <Paper p="xl" withBorder radius="xl" shadow="xl" 
                    style={{ 
                      width: '100%',
                      maxWidth: isMobile ? 300 : 400,
                      height: isMobile ? 300 : 400,
                      ...getPreviewAreaStyle(isMobile)
                    }}>
                    
                    <IconPreview 
                      imageUrl={baseImageUrl}
                      shape={shape}
                      imageScale={imageScale}
                      bgColor={bgColor}
                      isEditing={true}
                      hasImageError={imageError}
                    />
                  </Paper>

                  {/* ダウンロードボタン */}
                  <DownloadButton 
                    isDownloading={isDownloading}
                    hasError={imageError}
                    onDownload={handleDownload}
                  />
                </Box>

                {/* 右側/下部：カスタマイズパネル */}
                <Box style={{ 
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  minWidth: isMobile ? '100%' : '400px',
                  maxWidth: isMobile ? '100%' : '50%'
                }}>
                  <Title order={2} c="white" size={isMobile ? "1.5rem" : "2rem"} ta="center">カスタマイズ</Title>
                  
                  <CustomizePanel 
                    shape={shape}
                    imageScale={imageScale}
                    bgColor={bgColor}
                    onShapeChange={setShape}
                    onSizeChange={handleSizeChange}
                    onColorChange={setBgColor}
                    onOpenCustomPicker={() => setIsColorPickerOpen(true)}
                  />

                  {/* ツール終了ボタン */}
                  <Button
                    leftSection={<IconX size={16} />}
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'blue' }}
                    radius="xl"
                    size="lg"
                    onClick={() => setIsCustomizing(false)}
                    style={{ 
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      padding: '12px 24px'
                    }}
                  >
                    ツールを閉じる
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Container>

        {/* ===== カスタムカラーピッカー ===== */}
        <Transition
          mounted={isColorPickerOpen}
          transition="slide-left"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Box
              style={{
                ...styles,
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100vh',
                width: '320px',
                zIndex: 2000,
                backgroundColor: 'white',
                boxShadow: '-10px 0 40px rgba(0,0,0,0.3)',
                padding: '24px',
                overflowY: 'auto',
              }}
            >
              <Group justify="space-between" mb="lg">
                <Title order={3}>色を選択</Title>
                <ActionIcon
                  size="lg"
                  variant="subtle"
                  onClick={() => setIsColorPickerOpen(false)}
                >
                  <IconX size={20} />
                </ActionIcon>
              </Group>

              <ColorPicker
                value={bgColor}
                onChange={setBgColor}
                onChangeEnd={(color) => {
                  setBgColor(color);
                  setIsColorPickerOpen(false);
                }}
                format="hex"
                size="lg"
                swatches={[
                  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
                  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
                  '#feca57', '#48dbfb', '#ff0066', '#1dd1a1', '#ffa502'
                ]}
              />
            </Box>
          )}
        </Transition>
      </Box>
      
      {/* ===== 通知システム ===== */}
      {notification.show && (
        <Box
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 3000,
            maxWidth: '400px',
          }}
        >
          <Alert 
            icon={notification.type === 'success' ? <IconCheck size="1rem" /> : <IconAlertCircle size="1rem" />}
            title={notification.type === 'success' ? '成功' : 'エラー'}
            color={notification.type === 'success' ? 'green' : 'red'}
            withCloseButton
            onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            style={{
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              border: `1px solid ${notification.type === 'success' ? '#22c55e' : '#ef4444'}`,
            }}
          >
            {notification.message}
          </Alert>
        </Box>
      )}
    </MantineProvider>
  );
}

export default App;