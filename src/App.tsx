import { useState, useEffect } from 'react';
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
} from '@mantine/core';

import { IconX, IconDownload } from '@tabler/icons-react';

function App() {
  const [shape, setShape] = useState<string>('circle');
  const [imageScale, setImageScale] = useState<number>(80); // 画像の拡大率（60-100%）
  const [bgColor, setBgColor] = useState<string>('#60a5fa'); // blue-400
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  
  // リサイズイベントリスナー
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // WordPress ショートコードから画像URLを取得
  const baseImageUrl = (window as { ICON_EDITOR_CONFIG?: { baseImageUrl: string } }).ICON_EDITOR_CONFIG?.baseImageUrl || 'https://picsum.photos/256/256?random=1';
  

  // アイコンコンテナの固定サイズ
  const CONTAINER_SIZE = 256;

  const downloadIcon = async () => {
    console.log('ダウンロード開始:', { shape, imageScale, bgColor, baseImageUrl });
    
    // アイコンコンテナ要素を取得
    const iconContainer = document.querySelector('[data-icon-container]') as HTMLElement;
    if (!iconContainer) {
      console.error('アイコンコンテナが見つかりません');
      return;
    }

    try {
      // html2canvasでPNG画像を生成
      const canvas = await html2canvas(iconContainer, {
        useCORS: true, // CORS対応
        allowTaint: true,
        logging: false
      });

      // ダウンロード用のリンクを作成
      const link = document.createElement('a');
      link.download = `custom-icon-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      
      // ダウンロード実行
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('ダウンロード完了');
    } catch (error) {
      console.error('ダウンロードエラー:', error);
    }
  };

  // シンプル実装：画像1枚のみ

  const colorSwatches = [
    { color: '#a8dadc', name: 'ライトブルー' },
    { color: '#f1c0e8', name: 'ピンク' },
    { color: '#ffeb3b', name: 'イエロー' },
    { color: '#ff9800', name: 'オレンジ' },
    { color: '#2196f3', name: 'ブルー' },
    { color: '#4caf50', name: 'グリーン' },
    { color: '#f44336', name: 'レッド' },
    { color: '#ffffff', name: 'ホワイト' },
    { color: '#000000', name: 'ブラック' },
  ];

  // 画像サイズを計算（CONTAINER_SIZEの何%か）
  const imageSize = Math.round((CONTAINER_SIZE * imageScale) / 100);

  return (
    <MantineProvider>
      <Box style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container size="xl" py="xl" style={{ minHeight: '100vh' }}>
          {!isCustomizing ? (
            /* 初期状態 - 中央表示 */
            <Center style={{ minHeight: 'calc(100vh - 160px)' }}>
              <Stack align="center" gap="xl">
                <Stack align="center" gap="md">
                  <Title order={1} c="white" size="3rem">
                    アイコンエディター
                  </Title>
                  <Text c="white" size="lg" opacity={0.9}>
                    美しいアイコンを簡単にカスタマイズ・作成
                  </Text>
                </Stack>
                
                {/* メインプレビューエリア - 相対位置でボタン配置 */}
                <Box style={{ position: 'relative' }}>
                  <Paper 
                    p="xl" 
                    withBorder 
                    radius="xl"
                    shadow="xl"
                    style={{ 
                      minWidth: 400,
                      minHeight: 400,
                      background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* アイコンコンテナ - 初期状態は画像のみ */}
                    <Box
                      data-icon-container
                      style={{
                        width: CONTAINER_SIZE,
                        height: CONTAINER_SIZE,
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {/* ベース画像（WordPress管理画面で設定） */}
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

                  {/* カスタマイズボタン - ウロボロス風カラーパレット */}
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <Box
                      style={{
                        width: 28,
                        height: 28,
                        backgroundColor: 'rgba(240, 240, 240, 0.9)',
                        borderRadius: '6px',
                        border: '1px solid rgba(224, 224, 224, 0.8)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridTemplateRows: '1fr 1fr',
                        gap: '1px',
                        padding: '3px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {/* 4色のカラードット */}
                      <Box style={{ backgroundColor: '#ff6b6b', borderRadius: '50%', width: '6px', height: '6px' }} />
                      <Box style={{ backgroundColor: '#4ecdc4', borderRadius: '50%', width: '6px', height: '6px' }} />
                      <Box style={{ backgroundColor: '#45b7d1', borderRadius: '50%', width: '6px', height: '6px' }} />
                      <Box style={{ backgroundColor: '#f9ca24', borderRadius: '50%', width: '6px', height: '6px' }} />
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Center>
          ) : (
            /* 編集モード - 分離レイアウト */
            <Box style={{ minHeight: 'calc(100vh - 160px)', padding: '20px 0' }}>
              {/* レスポンシブフレックスコンテナ */}
              <Box style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: isMobile ? '1.5rem' : '2rem',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 1rem'
              }}>
                {/* 左側/上部: 画像プレビュー */}
                <Box style={{ 
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  minWidth: isMobile ? '100%' : '400px',
                  maxWidth: isMobile ? '100%' : '50%'
                }}>
                  <Title order={2} c="white" size="2rem">
                    プレビュー
                  </Title>
                  
                  <Paper 
                    p="xl" 
                    withBorder 
                    radius="xl"
                    shadow="xl"
                    style={{ 
                      width: '100%',
                      maxWidth: 400,
                      height: 400,
                      background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* アイコンコンテナ - 編集時は背景表示 */}
                    <Box
                      data-icon-container
                      style={{
                        width: CONTAINER_SIZE,
                        height: CONTAINER_SIZE,
                        backgroundColor: bgColor,
                        borderRadius: shape === 'circle' ? '50%' : '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                        border: '3px solid white',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                      }}
                    >
                      {/* ベース画像 */}
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
                    leftSection={<IconDownload size={20} />}
                    size="lg" 
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'blue' }}
                    onClick={downloadIcon}
                    style={{
                      fontSize: '1.1rem',
                      padding: '12px 24px',
                      fontWeight: 600
                    }}
                  >
                    アイコン画像ダウンロード
                  </Button>
                </Box>

                {/* 右側/下部: カスタマイズパネル */}
                <Box style={{ 
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  minWidth: isMobile ? '100%' : '400px',
                  maxWidth: isMobile ? '100%' : '50%'
                }}>
                  <Title order={2} c="white" size="2rem" ta="center">
                    カスタマイズ
                  </Title>
                  
                  <Paper 
                    p="lg" 
                    withBorder 
                    radius="xl"
                    shadow="md"
                    style={{ 
                      background: '#fef3c7',
                      border: '2px solid #fde68a',
                    }}
                  >
                    <Stack gap="md">
                      {/* 形状選択 */}
                      <Stack gap="xs">
                        <Text size="sm" fw={600} c="dark" ta="center">形状</Text>
                        <Group gap="sm" justify="center">
                          <Button
                            variant={shape === 'circle' ? 'filled' : 'light'}
                            color={shape === 'circle' ? 'blue' : 'gray'}
                            radius="lg"
                            size="sm"
                            onClick={() => setShape('circle')}
                            style={{
                              fontWeight: 500,
                              border: '2px solid',
                              borderColor: shape === 'circle' ? '#3b82f6' : '#d1d5db',
                            }}
                          >
                            まる●
                          </Button>
                          <Button
                            variant={shape === 'square' ? 'filled' : 'light'}
                            color={shape === 'square' ? 'blue' : 'gray'}
                            radius="lg"
                            size="sm"
                            onClick={() => setShape('square')}
                            style={{
                              fontWeight: 500,
                              border: '2px solid',
                              borderColor: shape === 'square' ? '#3b82f6' : '#d1d5db',
                            }}
                          >
                            □しかく
                          </Button>
                        </Group>
                      </Stack>

                      {/* 画像サイズ調整 */}
                      <Stack gap="xs">
                        <Text size="sm" fw={600} c="dark" ta="center">サイズ</Text>
                        <Group gap="sm" justify="center" align="center">
                          <Button
                            variant="light"
                            color="blue.7"
                            radius="md"
                            size="xs"
                            onClick={() => setImageScale(Math.max(60, imageScale - 5))}
                            disabled={imageScale <= 60}
                            style={{ fontWeight: 500 }}
                          >
                            小さく
                          </Button>
                          <Text size="md" fw={700} c="dark" style={{ minWidth: '40px', textAlign: 'center' }}>
                            {imageScale}%
                          </Text>
                          <Button
                            variant="light"
                            color="blue.7"
                            radius="md"
                            size="xs"
                            onClick={() => setImageScale(Math.min(150, imageScale + 5))}
                            disabled={imageScale >= 150}
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
                          {colorSwatches.map((swatch, index) => (
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
                              border: `3px solid ${!colorSwatches.find(s => s.color === bgColor) ? 'white' : '#374151'}`,
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

                  {/* 閉じるボタン */}
                  <Button
                    leftSection={<IconX size={16} />}
                    variant="filled"
                    color="red"
                    radius="xl"
                    onClick={() => setIsCustomizing(false)}
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    編集を終了
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Container>

        {/* カスタムカラーピッカー - 右サイドパネル */}
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
                onChange={(color) => {
                  setBgColor(color);
                }}
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
    </MantineProvider>
  );
}

export default App;