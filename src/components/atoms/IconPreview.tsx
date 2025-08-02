/**
 * IconPreviewコンポーネントのProps型定義
 */
interface IconPreviewProps {
  imageUrl: string /** アイコン画像のURL */;
  shape: "circle" | "square" /** アイコンの形状 (丸または角丸四角) */;
  size: number /** アイコンのサイズ (px単位) */;
  backgroundColor: string /** 背景色 (CSS color値) */;
}
/**
 * アイコンプレビューコンポーネント
 * 指定された画像、形状、サイズ、背景色でアイコンを表示する
 */
const IconPreview: React.FC<IconPreviewProps> = ({
  imageUrl,
  shape,
  size,
  backgroundColor,
}) => {
  // 形状に応じてCSSクラスを決定
  const shapeClasses = shape === "circle" ? "tw-rounded-full" : "tw-rounded-lg";

  return (
    <div
      className={`tw-inline-block tw-overflow-hidden tw-border-4 tw-border-blue-500 ${shapeClasses}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
      }}
    >
      <img
        src={imageUrl}
        alt="Icon preview"
        className="tw-w-full tw-h-full tw-object-cover"
      />
    </div>
  );
};

export default IconPreview;
