import React from 'react';

function App() {
  return (
    <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-indigo-50 tw-to-purple-100">
      <div className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <header className="tw-text-center tw-mb-12">
          <h1 className="tw-text-4xl tw-font-bold tw-text-gray-800 tw-mb-4">
            アイコンエディター
          </h1>
          <p className="tw-text-gray-600 tw-text-lg">
            美しいアイコンを簡単にカスタマイズ・作成
          </p>
        </header>

        <div className="tw-max-w-6xl tw-mx-auto tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-8">
          {/* プレビューエリア */}
          <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-p-8">
            <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6 tw-text-center">
              プレビュー
            </h2>
            <div className="tw-flex tw-justify-center tw-items-center tw-min-h-[300px]">
              <div className="tw-w-48 tw-h-48 tw-bg-blue-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-shadow-lg">
                <span className="tw-text-white tw-text-6xl">🎨</span>
              </div>
            </div>
            <div className="tw-mt-6 tw-text-center">
              <button className="tw-bg-blue-600 tw-text-white tw-px-8 tw-py-3 tw-rounded-lg tw-font-semibold tw-hover:tw-bg-blue-700 tw-transition-colors tw-shadow-md">
                PNG でダウンロード
              </button>
            </div>
          </div>

          {/* カスタマイズパネル */}
          <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-p-8">
            <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-6">
              カスタマイズ
            </h2>
            
            <div className="tw-space-y-8">
              {/* 形状選択 */}
              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">
                  形状
                </label>
                <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                  <button className="tw-p-4 tw-border-2 tw-border-blue-500 tw-bg-blue-50 tw-rounded-lg tw-flex tw-flex-col tw-items-center tw-gap-2">
                    <div className="tw-w-12 tw-h-12 tw-bg-blue-500 tw-rounded-full"></div>
                    <span className="tw-text-sm tw-font-medium">円形</span>
                  </button>
                  <button className="tw-p-4 tw-border-2 tw-border-gray-200 tw-bg-gray-50 tw-rounded-lg tw-flex tw-flex-col tw-items-center tw-gap-2 tw-hover:tw-border-blue-300">
                    <div className="tw-w-12 tw-h-12 tw-bg-gray-400 tw-rounded-md"></div>
                    <span className="tw-text-sm tw-font-medium">四角形</span>
                  </button>
                </div>
              </div>

              {/* サイズ調整 */}
              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">
                  サイズ: 192px
                </label>
                <input 
                  type="range" 
                  min="60" 
                  max="300" 
                  defaultValue="192"
                  className="tw-w-full tw-h-2 tw-bg-gray-200 tw-rounded-lg tw-appearance-none tw-cursor-pointer"
                />
              </div>

              {/* 背景色 */}
              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">
                  背景色
                </label>
                <div className="tw-flex tw-items-center tw-gap-4">
                  <input 
                    type="color" 
                    defaultValue="#3b82f6"
                    className="tw-w-16 tw-h-12 tw-border tw-border-gray-300 tw-rounded-lg tw-cursor-pointer"
                  />
                  <span className="tw-text-gray-600">#3b82f6</span>
                </div>
              </div>

              {/* 画像アップロード */}
              <div>
                <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-3">
                  画像アップロード
                </label>
                <div className="tw-border-2 tw-border-dashed tw-border-gray-300 tw-rounded-lg tw-p-8 tw-text-center tw-hover:tw-border-blue-400 tw-transition-colors">
                  <div className="tw-text-gray-400 tw-mb-2">
                    <svg className="tw-mx-auto tw-h-12 tw-w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="tw-text-sm tw-text-gray-600 tw-mb-2">
                    画像をドラッグ&ドロップ
                  </p>
                  <p className="tw-text-xs tw-text-gray-400">
                    または
                  </p>
                  <button className="tw-mt-2 tw-text-blue-600 tw-text-sm tw-font-medium tw-hover:tw-underline">
                    ファイルを選択
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;