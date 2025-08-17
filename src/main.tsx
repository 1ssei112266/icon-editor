import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// WordPress環境での複数インスタンス対応
declare global {
  interface Window {
    ICON_EDITOR_INSTANCES?: { [key: string]: { baseImageUrl: string; pluginUrl: string; instanceId: string } };
    ICON_EDITOR_CONFIG?: { baseImageUrl: string };
  }
}

// 複数のIcon Customizerインスタンスを初期化
function initializeIconCustomizers() {
  // 新しい複数インスタンス形式をチェック
  if (window.ICON_EDITOR_INSTANCES) {
    Object.entries(window.ICON_EDITOR_INSTANCES).forEach(([instanceId, config]) => {
      const container = document.getElementById(instanceId);
      if (container) {
        const root = createRoot(container);
        root.render(
          <StrictMode>
            <App instanceConfig={config} />
          </StrictMode>
        );
      }
    });
  }
  // 旧式の単一インスタンス形式をチェック（後方互換性）
  else if (window.ICON_EDITOR_CONFIG) {
    const container = document.getElementById('root');
    if (container) {
      const root = createRoot(container);
      root.render(
        <StrictMode>
          <App instanceConfig={window.ICON_EDITOR_CONFIG} />
        </StrictMode>
      );
    }
  }
  // 開発環境での通常起動
  else {
    const container = document.getElementById('root');
    if (container) {
      const root = createRoot(container);
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    }
  }
}

// WordPress環境での確実な初期化
function tryInitialize() {
  // インスタンス設定が存在するかチェック
  if (window.ICON_EDITOR_INSTANCES && Object.keys(window.ICON_EDITOR_INSTANCES).length > 0) {
    initializeIconCustomizers();
    return true;
  }
  return false;
}

// 複数のタイミングで初期化を試行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!tryInitialize()) {
      // WordPressでは設定が遅れて読み込まれる場合があるため、少し待ってから再試行
      setTimeout(tryInitialize, 100);
      setTimeout(tryInitialize, 500);
      setTimeout(tryInitialize, 1000);
    }
  });
} else {
  if (!tryInitialize()) {
    setTimeout(tryInitialize, 100);
    setTimeout(tryInitialize, 500);
    setTimeout(tryInitialize, 1000);
  }
}
