import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '@mantine/core/styles.css';
import html2canvas from 'html2canvas';
import {
  MantineProvider,
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Paper,
  Center,
  Box,
  ActionIcon,
  Transition,
  ColorPicker,
  Loader,
  Alert,
} from '@mantine/core';
import { IconX, IconDownload, IconAlertCircle, IconCheck } from '@tabler/icons-react';

// =============================================================================
// 定数定義
// =============================================================================

/** アイコンコンテナの固定サイズ（256px） */
const CONTAINER_SIZE = 256;

/** サイズ調整の範囲 */
const SIZE_LIMITS = {
  MIN: 10,    // 最小10%
  MAX: 150,   // 最大150%
  STEP: 5     // 5%刻み
} as const;

/** モバイル判定の閾値 */
const MOBILE_BREAKPOINT = 768;


/** 背景色のプリセット */
const COLOR_SWATCHES = [
  { color: '#a8dadc', name: 'ライトブルー' },
  { color: '#f1c0e8', name: 'ピンク' },
  { color: '#ffeb3b', name: 'イエロー' },
  { color: '#ff9800', name: 'オレンジ' },
  { color: '#2196f3', name: 'ブルー' },
  { color: '#4caf50', name: 'グリーン' },
  { color: '#f44336', name: 'レッド' },
  { color: '#ffffff', name: 'ホワイト' },
  { color: '#000000', name: 'ブラック' },
] as const;

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

/** カスタマイズパネルの背景スタイル */
const customizePanelStyle = {
  background: '#fef3c7',
  border: '2px solid #fde68a',
};

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
    || 'https://picsum.photos/256/256?random=1'
  , []);
  
  /** 実際の画像サイズ（ピクセル値）（メモ化） */
  const imageSize = useMemo(() => Math.round((CONTAINER_SIZE * imageScale) / 100), [imageScale]);

  // ---------------------------------------------------------------------------
  // イベントハンドラー
  // ---------------------------------------------------------------------------
  
  /** サイズ調整ハンドラー（メモ化） */
  const handleSizeChange = useCallback((increment: number) => {
    setImageScale(prev => 
      Math.max(SIZE_LIMITS.MIN, Math.min(SIZE_LIMITS.MAX, prev + increment))
    );
  }, []);

  /** PNG画像ダウンロード処理（メモ化） */
  const downloadIcon = useCallback(async () => {
    if (isDownloading) return; // 重複処理防止
    
    setIsDownloading(true);
    console.log('ダウンロード開始:', { shape, imageScale, bgColor, baseImageUrl });
    
    try {
      const iconContainer = document.querySelector('[data-icon-container]') as HTMLElement;
      if (!iconContainer) {
        throw new Error('アイコンコンテナが見つかりません');
      }

      // html2canvasで画像生成
      const canvas = await html2canvas(iconContainer, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        // scale: 2, // 高解像度出力（html2canvasの型定義にないためコメントアウト）
        // background: null
      });

      // ダウンロード実行
      const link = document.createElement('a');
      link.download = `custom-icon-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('success', 'アイコンのダウンロードが完了しました');
      console.log('ダウンロード完了');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ダウンロードに失敗しました';
      showNotification('error', errorMessage);
      console.error('ダウンロードエラー:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading, shape, imageScale, bgColor, baseImageUrl, showNotification]);

  // ---------------------------------------------------------------------------
  // レンダリング用ヘルパー
  // ---------------------------------------------------------------------------
  
  /** アイコンコンテナのスタイル（初期 / 編集時で異なる）（メモ化） */
  const getIconContainerStyle = useMemo(() => (isEditing: boolean) => ({
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    backgroundColor: isEditing ? bgColor : 'transparent',
    borderRadius: isEditing && shape === 'circle' ? '50%' : '16px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    boxShadow: isEditing ? '0 10px 20px rgba(0,0,0,0.15)' : 'none',
    border: isEditing ? '3px solid white' : 'none',
    transition: 'all 0.3s ease',
    overflow: 'hidden' as const,
  }), [bgColor, shape]);

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
                    
                    {/* アイコンコンテナ（初期状態） */}
                    <Box data-icon-container style={getIconContainerStyle(false)}>
                      {imageError ? (
                        <Alert 
                          icon={<IconAlertCircle size="1rem" />} 
                          title="画像読み込みエラー" 
                          color="orange"
                          style={{ width: imageSize, height: imageSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          画像を読み込めません
                        </Alert>
                      ) : (
                        <Box
                          style={{
                            width: imageSize,
                            height: imageSize,
                            backgroundImage: `url(${baseImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '0px',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      )}
                    </Box>
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
                    
                    {/* アイコンコンテナ（編集時） */}
                    <Box data-icon-container style={getIconContainerStyle(true)}>
                      <Box
                        style={{
                          width: imageSize,
                          height: imageSize,
                          backgroundImage: `url(${baseImageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: '0px',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </Box>
                  </Paper>

                  {/* ダウンロードボタン */}
                  <Button 
                    leftSection={isDownloading ? <Loader size={20} color="white" /> : <IconDownload size={20} />}
                    size="lg" 
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'blue' }}
                    onClick={downloadIcon}
                    loading={isDownloading}
                    disabled={isDownloading || imageError}
                    style={{
                      fontSize: '1.1rem',
                      padding: '12px 24px',
                      fontWeight: 600
                    }}
                  >
                    {isDownloading ? 'ダウンロード中...' : 'アイコン画像ダウンロード'}
                  </Button>
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
                  
                  <Paper p="lg" withBorder radius="xl" shadow="md" style={customizePanelStyle}>
                    <Stack gap="md">
                      
                      {/* 形状選択 */}
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
                              onClick={() => setShape(shapeOption)}
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

                      {/* サイズ調整 */}
                      <Stack gap="xs">
                        <Text size="sm" fw={600} c="dark" ta="center">サイズ</Text>
                        <Group gap="sm" justify="center" align="center">
                          <Button
                            variant="light"
                            color="blue.7"
                            radius="md"
                            size="xs"
                            onClick={() => handleSizeChange(-SIZE_LIMITS.STEP)}
                            disabled={imageScale <= SIZE_LIMITS.MIN}
                            style={{ fontWeight: 500 }}
                          >
                            小さく
                          </Button>
                          <Text size="md" fw={700} c="dark" style={{ minWidth: '50px', textAlign: 'center' }}>
                            {imageScale}%
                          </Text>
                          <Button
                            variant="light"
                            color="blue.7"
                            radius="md"
                            size="xs"
                            onClick={() => handleSizeChange(SIZE_LIMITS.STEP)}
                            disabled={imageScale >= SIZE_LIMITS.MAX}
                            style={{ fontWeight: 500 }}
                          >
                            大きく
                          </Button>
                        </Group>
                      </Stack>

                      {/* カラーパレット */}
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
                              onClick={() => setBgColor(swatch.color)}
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
                            onClick={() => setIsColorPickerOpen(true)}
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
                    </Stack>
                  </Paper>

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
                <Text size="lg" fw={700}>色を選択</Text>
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