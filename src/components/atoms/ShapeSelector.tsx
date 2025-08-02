/**
 * ShapeSelectorコンポーネントのProps型定義
 */
interface ShapeSelectorProps {
  selectedShape: 'circle' | 'square';  /** 現在選択されている形状 */
  onChangeShape: (shape: 'circle' | 'square') => void;  /** 形状変更時に呼ばれるコールバック関数 */
}

/**
 * 形状選択コンポーネント（Atom）
 * 丸・角の2つのボタンで形状を切り替える
 */
const ShapeSelector: React.FC<ShapeSelectorProps> = ({ selectedShape, onChangeShape }) => {
  return (
    <div className="tw-text-center tw-space-y-4">
      <h3 className="tw-text-lg tw-font-bold">形状選択</h3>
      <div className="tw-flex tw-justify-center tw-gap-4">
        {/* 丸ボタン */}
        <button
          className={`tw-px-6 tw-py-3 tw-rounded-lg tw-font-bold tw-transition-colors ${
            selectedShape === "circle"
              ? "tw-bg-blue-500 tw-text-white"
              : "tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300"
          }`}
          onClick={() => onChangeShape("circle")}
        >
          まる●
        </button>
        
        {/* 四角ボタン */}
        <button
          className={`tw-px-6 tw-py-3 tw-rounded-lg tw-font-bold tw-transition-colors ${
            selectedShape === "square"
              ? "tw-bg-blue-500 tw-text-white"
              : "tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300"
          }`}
          onClick={() => onChangeShape("square")}
        >
          □しかく
        </button>
      </div>
    </div>
  );
};

export default ShapeSelector;