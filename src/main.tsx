import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css'
import App from './App.tsx'

// WordPress環境での複数インスタンス対応
declare global {
  interface Window {
    ICON_EDITOR_INSTANCES?: { [key: string]: { baseImageUrl: string; pluginUrl: string; instanceId: string } };
    ICON_EDITOR_CONFIG?: { baseImageUrl: string };
  }
}

// React Rootインスタンスを管理（重複実行防止）
const rootInstances = new Map<string, ReturnType<typeof createRoot>>();

// 複数のIcon Customizerインスタンスを初期化
function initializeIconCustomizers() {
  // 新しい複数インスタンス形式をチェック
  if (window.ICON_EDITOR_INSTANCES) {
    Object.entries(window.ICON_EDITOR_INSTANCES).forEach(([instanceId, config]) => {
      const container = document.getElementById(instanceId);
      if (container) {
        // 既にrootが作成されているかチェック
        if (!rootInstances.has(instanceId)) {
          const root = createRoot(container);
          rootInstances.set(instanceId, root);
          
          root.render(
            <StrictMode>
              <App instanceConfig={config} />
            </StrictMode>
          );
        } else {
          const root = rootInstances.get(instanceId)!;
          root.render(
            <StrictMode>
              <App instanceConfig={config} />
            </StrictMode>
          );
        }
      }
    });
  }
  // 旧式の単一インスタンス形式をチェック（後方互換性）
  else if (window.ICON_EDITOR_CONFIG) {
    const container = document.getElementById('root');
    if (container && !rootInstances.has('root')) {
      const root = createRoot(container);
      rootInstances.set('root', root);
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
    if (container && !rootInstances.has('root')) {
      const root = createRoot(container);
      rootInstances.set('root', root);
      root.render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    }
  }
}

// 初期化実行状況を管理
let initializationAttempted = false;

// WordPress環境での確実な初期化
function tryInitialize() {
  // インスタンス設定が存在するかチェック
  if (window.ICON_EDITOR_INSTANCES && Object.keys(window.ICON_EDITOR_INSTANCES).length > 0) {
    if (!initializationAttempted) {
      initializationAttempted = true;
      initializeIconCustomizers();
      return true;
    } else {
      return true;
    }
  }
  
  return false;
}

// 複数のタイミングで初期化を試行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!tryInitialize()) {
      // 開発環境では即座に通常初期化を実行
      initializeIconCustomizers();
    }
  });
} else {
  if (!tryInitialize()) {
    // 開発環境では即座に通常初期化を実行
    initializeIconCustomizers();
  }
}
