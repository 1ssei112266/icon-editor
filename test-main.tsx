import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleColorTest from './SimpleColorTest.tsx'

// WordPress環境での複数インスタンス対応
declare global {
  interface Window {
    COLOR_TEST_INSTANCES?: { [key: string]: any };
  }
}

// React Rootインスタンスを管理（重複実行防止）
const rootInstances = new Map<string, ReturnType<typeof createRoot>>();

// 色変更テストの初期化
function initializeColorTest() {
  console.log('🚀 initializeColorTest 開始');
  
  // 新しい複数インスタンス形式をチェック
  if (window.COLOR_TEST_INSTANCES) {
    console.log('📦 WordPress環境でのインスタンス初期化', window.COLOR_TEST_INSTANCES);
    Object.keys(window.COLOR_TEST_INSTANCES).forEach((instanceId) => {
      console.log('🔍 Instance ID を処理中:', instanceId);
      const container = document.getElementById(instanceId);
      if (container) {
        console.log('✅ コンテナ要素が見つかりました:', container);
        // 既にrootが作成されているかチェック
        if (!rootInstances.has(instanceId)) {
          const root = createRoot(container);
          rootInstances.set(instanceId, root);
          
          console.log('🎯 React コンポーネントをレンダリング中...');
          root.render(
            <StrictMode>
              <SimpleColorTest />
            </StrictMode>
          );
          console.log('✅ レンダリング完了');
        }
      } else {
        console.error('❌ コンテナ要素が見つかりません:', instanceId);
      }
    });
  }
  // 開発環境での通常起動
  else {
    console.log('🛠️ 開発環境での初期化');
    const container = document.getElementById('root');
    if (container && !rootInstances.has('root')) {
      const root = createRoot(container);
      rootInstances.set('root', root);
      root.render(
        <StrictMode>
          <SimpleColorTest />
        </StrictMode>
      );
      console.log('✅ 開発環境でのレンダリング完了');
    }
  }
}

// 初期化実行状況を管理
let initializationAttempted = false;

// WordPress環境での確実な初期化
function tryInitialize() {
  console.log('🔍 tryInitialize 実行中', {
    instances: window.COLOR_TEST_INSTANCES,
    keys: window.COLOR_TEST_INSTANCES ? Object.keys(window.COLOR_TEST_INSTANCES) : [],
    attempted: initializationAttempted
  });
  
  // インスタンス設定が存在するかチェック
  if (window.COLOR_TEST_INSTANCES && Object.keys(window.COLOR_TEST_INSTANCES).length > 0) {
    if (!initializationAttempted) {
      initializationAttempted = true;
      console.log('✅ WordPress環境での初期化開始');
      initializeColorTest();
      return true;
    } else {
      return true;
    }
  }
  
  return false;
}

// 複数のタイミングで初期化を試行
console.log('📋 初期化スクリプト実行開始', {
  readyState: document.readyState,
  timestamp: new Date()
});

if (document.readyState === 'loading') {
  console.log('⏳ DOMContentLoaded待機中...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded イベント発火');
    if (!tryInitialize()) {
      console.log('🛠️ 開発環境での初期化にフォールバック');
      initializeColorTest();
    }
  });
} else {
  console.log('✅ DOM既に準備完了、即座に初期化');
  if (!tryInitialize()) {
    console.log('🛠️ 開発環境での初期化にフォールバック');
    initializeColorTest();
  }
}

// 追加の初期化タイミング（WordPress環境対応）
setTimeout(() => {
  console.log('⏰ 500ms後の追加初期化チェック');
  if (!initializationAttempted) {
    tryInitialize() || initializeColorTest();
  }
}, 500);

setTimeout(() => {
  console.log('⏰ 2秒後の最終初期化チェック');
  if (!initializationAttempted) {
    tryInitialize() || initializeColorTest();
  }
}, 2000);