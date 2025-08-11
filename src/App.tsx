import { useState } from 'react';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
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
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX, IconDownload, IconSettings } from '@tabler/icons-react';

function App() {
  const [shape, setShape] = useState<string>('circle');
  const [imageScale, setImageScale] = useState<number>(80); // 画像の拡大率（60-100%）
  const [bgColor, setBgColor] = useState<string>('#60a5fa'); // blue-400
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  
  // アイコンコンテナの固定サイズ
  const CONTAINER_SIZE = 256;

  const handleDrop = (files: File[]) => {
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const downloadIcon = () => {
    console.log('ダウンロード開始:', { shape, imageScale, bgColor });
  };

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
                  {/* 固定サイズのアイコンコンテナ */}
                  <Box
                    style={{
                      width: CONTAINER_SIZE,
                      height: CONTAINER_SIZE,
                      backgroundColor: bgColor,
                      borderRadius: shape === 'circle' ? '50%' : '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      border: '4px solid white',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden', // 画像がはみ出ないように
                    }}
                  >
                    {imageUrl ? (
                      /* カスタム画像 - サイズ可変 */
                      <Box
                        style={{
                          width: imageSize,
                          height: imageSize,
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: shape === 'circle' ? '50%' : '8px',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ) : (
                      /* デフォルトアイコン - サイズも可変 */
                      <Box
                        style={{
                          width: imageSize,
                          height: imageSize,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: `${imageSize * 0.25}px`, // アイコンサイズに比例
                          opacity: 0.7,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        🎨
                      </Box>
                    )}
                  </Box>
                </Paper>

                {/* カスタマイズボタン - プレビュー内左下 */}
                <ActionIcon
                  size={40}
                  radius="xl"
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '2px solid rgba(229, 231, 235, 1)',
                    color: '#6b7280',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                    e.currentTarget.style.color = '#3b82f6';
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                  }}
                >
                  <IconSettings size={20} stroke={1.5} />
                </ActionIcon>
              </Box>

              {/* ダウンロードボタン */}
              <Button 
                leftSection={<IconDownload size={20} />}
                size="xl" 
                radius="xl"
                variant="gradient"
                gradient={{ from: 'cyan', to: 'blue' }}
                onClick={downloadIcon}
                style={{
                  fontSize: '1.2rem',
                  padding: '16px 32px',
                  fontWeight: 600
                }}
              >
                アイコン画像ダウンロード
              </Button>
            </Stack>
          </Center>
        </Container>

        {/* 下部からスライドインするツールパネル */}
        <Transition
          mounted={isCustomizing}
          transition="slide-up"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Box
              style={{
                ...styles,
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                minWidth: '90%',
                maxWidth: '800px',
              }}
            >
              <Box
                style={{
                  backgroundColor: '#fef3c7', // amber-50
                  borderRadius: '24px 24px 0 0',
                  padding: '20px 24px',
                  border: '3px solid #fde68a', // amber-100
                  boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
                }}
              >
                <Stack gap="md">
                  {/* 形状選択 */}
                  <Group gap="sm" justify="center" align="center">
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
                    <Text c="gray.4" size="lg" fw={300}>⟷</Text>
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

                  {/* 画像サイズ調整 */}
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

                  {/* カラーパレット */}
                  <Group gap="xs" justify="center">
                    {colorSwatches.map((swatch, index) => (
                      <ActionIcon
                        key={index}
                        size={28}
                        radius="50%"
                        variant="subtle"
                        style={{
                          backgroundColor: swatch.color,
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
                  </Group>

                  {/* 利用規約テキスト */}
                  <Text ta="center" size="xs" c="dark" opacity={0.7}>
                    利用規約を確認してから使ってね
                  </Text>
                </Stack>
              </Box>
              
              {/* 閉じるボタン - パネル外に配置 */}
              <Group justify="center" mt="md">
                <Button
                  leftSection={<IconX size={16} />}
                  variant="filled"
                  color="cyan"
                  radius="xl"
                  onClick={() => setIsCustomizing(false)}
                  style={{
                    fontWeight: 500,
                    border: '2px dashed rgba(34, 211, 238, 0.7)',
                    backgroundColor: '#06b6d4',
                  }}
                >
                  ツールを閉じる
                </Button>
              </Group>
            </Box>
          )}
        </Transition>

        {/* 全画面ドロップゾーン */}
        <Dropzone
          onDrop={handleDrop}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            backgroundColor: 'transparent',
            border: 'none'
          }}
        >
          <Box />
        </Dropzone>
      </Box>
    </MantineProvider>
  );
}

export default App;