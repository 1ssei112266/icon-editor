import React from 'react';

/**
 * LoadingSpinnerコンポーネントのProps型定義
 * ローディング状態を視覚的に表示するためのスピナーコンポーネント
 */
interface LoadingSpinnerProps {
  /** ローディングメッセージ（オプション） */
  message?: string;
  /** サイズ - small: 16px, medium: 24px, large: 32px */
  size?: 'small' | 'medium' | 'large';
  /** 色テーマ - primary: 青系, secondary: グレー系, accent: 紫系 */
  color?: 'primary' | 'secondary' | 'accent';
}

/**
 * ローディングスピナーコンポーネント（Atom）
 * 
 * 主な機能:
 * - CSS アニメーションによる滑らかなスピン効果
 * - 3種類のサイズ対応（small, medium, large）
 * - 3種類の色テーマ対応
 * - カスタムローディングメッセージ表示
 * - アクセシビリティ対応（screen reader用のaria-label）
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "読み込み中...",
  size = "medium",
  color = "primary"
}) => {
  // サイズに応じたクラス設定
  const sizeClasses = {
    small: "tw-w-4 tw-h-4",
    medium: "tw-w-6 tw-h-6", 
    large: "tw-w-8 tw-h-8"
  };

  // 色テーマに応じたクラス設定
  const colorClasses = {
    primary: "tw-border-blue-500 tw-border-t-transparent",
    secondary: "tw-border-gray-500 tw-border-t-transparent",
    accent: "tw-border-purple-500 tw-border-t-transparent"
  };

  // メッセージの文字サイズ調整
  const messageSizeClasses = {
    small: "tw-text-xs",
    medium: "tw-text-sm",
    large: "tw-text-base"
  };

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3">
      {/* スピナー本体 */}
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          tw-border-2 tw-border-solid tw-rounded-full tw-animate-spin
        `}
        role="status"
        aria-label={message}
        title={message}
      />
      
      {/* ローディングメッセージ */}
      {message && (
        <p className={`
          ${messageSizeClasses[size]}
          tw-text-gray-600 tw-font-medium tw-animate-pulse
        `}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;