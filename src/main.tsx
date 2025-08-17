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
  console.log('🚀 Icon Customizer: 初期化関数開始');
  
  // 新しい複数インスタンス形式をチェック
  if (window.ICON_EDITOR_INSTANCES) {
    Object.entries(window.ICON_EDITOR_INSTANCES).forEach(([instanceId, config]) => {
      const container = document.getElementById(instanceId);
      if (container) {
        // 既にrootが作成されているかチェック
        if (!rootInstances.has(instanceId)) {
          console.log(`✨ Icon Customizer: 新しいroot作成 (${instanceId})`);
          const root = createRoot(container);
          rootInstances.set(instanceId, root);
          
          root.render(
            <StrictMode>
              <App instanceConfig={config} />
            </StrictMode>
          );
        } else {
          console.log(`♻️ Icon Customizer: 既存root再利用 (${instanceId})`);
          const root = rootInstances.get(instanceId)!;
          root.render(
            <StrictMode>
              <App instanceConfig={config} />
            </StrictMode>
          );
        }
      } else {
        console.warn(`❌ Icon Customizer: コンテナが見つかりません (${instanceId})`);
      }
    });
  }
  // 旧式の単一インスタンス形式をチェック（後方互換性）
  else if (window.ICON_EDITOR_CONFIG) {
    const container = document.getElementById('root');
    if (container && !rootInstances.has('root')) {
      console.log('✨ Icon Customizer: 旧式root作成');
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
      console.log('✨ Icon Customizer: 開発環境root作成');
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

// WordPress環境での確実な初期化（デバッグ強化版）
function tryInitialize() {
  console.log('🔍 Icon Customizer: 初期化試行開始', {
    readyState: document.readyState,
    hasInstances: !!(window.ICON_EDITOR_INSTANCES),
    instanceCount: window.ICON_EDITOR_INSTANCES ? Object.keys(window.ICON_EDITOR_INSTANCES).length : 0,
    attempted: initializationAttempted,
    timestamp: new Date().toISOString()
  });
  
  // インスタンス設定が存在するかチェック
  if (window.ICON_EDITOR_INSTANCES && Object.keys(window.ICON_EDITOR_INSTANCES).length > 0) {
    if (!initializationAttempted) {
      console.log('✅ Icon Customizer: インスタンス設定発見、初期化開始', window.ICON_EDITOR_INSTANCES);
      initializationAttempted = true;
      initializeIconCustomizers();
      return true;
    } else {
      console.log('⚠️ Icon Customizer: 既に初期化済み、スキップ');
      return true;
    }
  }
  
  console.log('⏳ Icon Customizer: インスタンス設定待機中...');
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
