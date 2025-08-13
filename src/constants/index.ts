// =============================================================================
// 定数定義
// =============================================================================

/** アイコンコンテナの固定サイズ（256px） */
export const CONTAINER_SIZE = 256;

/** 高解像度ダウンロード用のサイズ（1024px） */
export const DOWNLOAD_SIZE = 1024;

/** サイズ調整の範囲 */
export const SIZE_LIMITS = {
  MIN: 10,    // 最小10%
  MAX: 150,   // 最大150%
  STEP: 5     // 5%刻み
} as const;

/** モバイル判定の閾値 */
export const MOBILE_BREAKPOINT = 768;

/** 背景色のプリセット */
export const COLOR_SWATCHES = [
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