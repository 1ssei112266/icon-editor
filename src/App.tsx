import React, { useState } from "react";
import { IconPreview, ShapeSelector } from "./components";

/**
 * アイコンエディタのメインページコンポーネント
 * 
 * 機能概要:
 * - アイコンの形状（circle/square）、サイズ、背景色を制御
 * - リアルタイムプレビュー表示
 * - PNG形式でのダウンロード機能
 * - WordPressショートコード埋め込み対応を想定した設計
 */
const TestPage: React.FC = () => {
  // アイコン形状の状態管理 - 初期値は円形
  const [shape, setShape] = useState<"circle" | "square">("circle");
  // アイコンサイズの状態管理 - 初期値128px（適度なプレビューサイズ）
  const [size, setSize] = useState(128);
  // 背景色の状態管理 - 初期値は視認性の良い金色
  const [bgColor, setBgColor] = useState("#FFD700");

  /**
   * アイコンサイズを大きくする関数
   * 最大サイズ300pxで制限（UI表示とパフォーマンスのバランス）
   */
  const increaseSize = () => {
    setSize(prev => Math.min(prev + 20, 300));
  };

  /**
   * アイコンサイズを小さくする関数
   * 最小サイズ60pxで制限（視認性を保つため）
   */
  const decreaseSize = () => {
    setSize(prev => Math.max(prev - 20, 60));
  };

  return (
    <div className="tw-p-8 tw-space-y-6 tw-max-w-md tw-mx-auto">
      {/* アイコンプレビューエリア - 灰色背景で視認性向上 */}
      <div className="tw-flex tw-justify-center tw-p-8 tw-bg-gray-100 tw-rounded-lg">
        <IconPreview
          imageUrl="https://picsum.photos/200/200?random=1" // テスト用のランダム画像（本番では設定可能にする予定）
          shape={shape}
          size={size}
          backgroundColor={bgColor}
          onDownload={() => console.log('PNG ダウンロード開始 - サイズ:', size, '形状:', shape, '背景色:', bgColor)}
        />
      </div>
      
      {/* 現在の設定値表示エリア（デバッグ・確認用） */}
      <div className="tw-text-center tw-p-4 tw-bg-yellow-100 tw-rounded">
        <h4 className="tw-font-bold">現在の設定</h4>
        <p>形状: {shape === "circle" ? "丸●" : "□四角"}</p>
        <p>サイズ: {size}px</p>
        <p>背景色: {bgColor}</p>
      </div>

      {/* サイズ調整コントロール */}
      <div className="tw-text-center tw-space-y-4">
        <h3 className="tw-text-lg tw-font-bold">サイズ調整</h3>
        <div className="tw-flex tw-justify-center tw-gap-4">
          <button
            className="tw-px-6 tw-py-3 tw-bg-blue-500 tw-text-white tw-rounded-lg tw-font-bold hover:tw-bg-blue-600 tw-transition-colors"
            onClick={decreaseSize}
            disabled={size <= 60} // 最小サイズに達した場合は無効化
            title="アイコンサイズを20px小さくする（最小60px）"
          >
            小さく
          </button>
          <button
            className="tw-px-6 tw-py-3 tw-bg-blue-500 tw-text-white tw-rounded-lg tw-font-bold hover:tw-bg-blue-600 tw-transition-colors"
            onClick={increaseSize}
            disabled={size >= 300} // 最大サイズに達した場合は無効化
            title="アイコンサイズを20px大きくする（最大300px）"
          >
            大きく
          </button>
        </div>
        <p className="tw-text-sm tw-text-gray-600">現在のサイズ: {size}px（範囲: 60-300px）</p>
      </div>

      {/* 形状選択コンポーネント */}
      <ShapeSelector
        selectedShape={shape}
        onChangeShape={setShape}
      />

      {/* 背景色選択コントロール */}
      <div className="tw-text-center tw-space-y-4">
        <h3 className="tw-text-lg tw-font-bold">背景色</h3>
        <div className="tw-flex tw-justify-center">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="tw-w-16 tw-h-16 tw-rounded-lg tw-border-2 tw-border-gray-300 tw-cursor-pointer"
            title="アイコンの背景色を選択"
          />
        </div>
        <p className="tw-text-sm tw-text-gray-600">選択中: {bgColor}</p>
      </div>
    </div>
  );
};

export default TestPage;
