import React, { useState } from "react";
import IconPreview from "./components/IconPreview";

const TestPage: React.FC = () => {
  const [shape, setShape] = useState<"circle" | "square">("circle");
  const [size, setSize] = useState(128);
  const [bgColor, setBgColor] = useState("#FFD700");

  // サイズ調整関数
  const increaseSize = () => {
    setSize(prev => Math.min(prev + 20, 300)); // 最大300px
  };

  const decreaseSize = () => {
    setSize(prev => Math.max(prev - 20, 60)); // 最小60px
  };

  return (
    <div className="tw-p-8 tw-space-y-6 tw-max-w-md tw-mx-auto">
      {/* プレビューエリア */}
      <div className="tw-flex tw-justify-center tw-p-8 tw-bg-gray-100 tw-rounded-lg">
        <IconPreview
          imageUrl="https://picsum.photos/200/200?random=1"
          shape={shape}
          size={size}
          backgroundColor={bgColor}
        />
      </div>
      
      {/* デバッグ情報 */}
      <div className="tw-text-center tw-p-4 tw-bg-yellow-100 tw-rounded">
        <h4 className="tw-font-bold">現在の設定</h4>
        <p>形状: {shape === "circle" ? "丸●" : "□四角"}</p>
        <p>サイズ: {size}px</p>
        <p>背景色: {bgColor}</p>
      </div>

      {/* サイズ調整 */}
      <div className="tw-text-center tw-space-y-4">
        <h3 className="tw-text-lg tw-font-bold">サイズ調整</h3>
        <div className="tw-flex tw-justify-center tw-gap-4">
          <button
            className="tw-px-6 tw-py-3 tw-bg-blue-500 tw-text-white tw-rounded-lg tw-font-bold hover:tw-bg-blue-600"
            onClick={decreaseSize}
          >
            小さく
          </button>
          <button
            className="tw-px-6 tw-py-3 tw-bg-blue-500 tw-text-white tw-rounded-lg tw-font-bold hover:tw-bg-blue-600"
            onClick={increaseSize}
          >
            大きく
          </button>
        </div>
        <p className="tw-text-sm tw-text-gray-600">現在のサイズ: {size}px</p>
      </div>

      {/* 形状選択 */}
      <div className="tw-text-center tw-space-y-4">
        <h3 className="tw-text-lg tw-font-bold">形状選択</h3>
        <div className="tw-flex tw-justify-center tw-gap-4">
          <button
            className={`tw-px-6 tw-py-3 tw-rounded-lg tw-font-bold ${
              shape === "circle"
                ? "tw-bg-green-500 tw-text-white"
                : "tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300"
            }`}
            onClick={() => setShape("circle")}
          >
            まる●
          </button>
          <button
            className={`tw-px-6 tw-py-3 tw-rounded-lg tw-font-bold ${
              shape === "square"
                ? "tw-bg-green-500 tw-text-white"
                : "tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300"
            }`}
            onClick={() => setShape("square")}
          >
            □しかく
          </button>
        </div>
      </div>

      {/* 背景色選択 */}
      <div className="tw-text-center tw-space-y-4">
        <h3 className="tw-text-lg tw-font-bold">背景色</h3>
        <div className="tw-flex tw-justify-center">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="tw-w-16 tw-h-16 tw-rounded-lg tw-border-2 tw-border-gray-300"
          />
        </div>
        <p className="tw-text-sm tw-text-gray-600">選択中: {bgColor}</p>
      </div>
    </div>
  );
};

export default TestPage;
