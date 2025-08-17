import React, { useState } from 'react';

// WordPress環境での動作確認用の簡素なReactアプリ
interface SimpleAppProps {
  instanceConfig?: {
    baseImageUrl?: string;
    pluginUrl?: string;
    instanceId?: string;
  };
}

const SimpleApp: React.FC<SimpleAppProps> = ({ instanceConfig }) => {
  const [message, setMessage] = useState('React初期化中...');
  const [color, setColor] = useState('#3b82f6');
  const [shape, setShape] = useState<'circle' | 'square'>('circle');
  const [size, setSize] = useState(100);

  React.useEffect(() => {
    setMessage('React アプリが正常に動作しています！');
    console.log('SimpleApp mounted with config:', instanceConfig);
  }, [instanceConfig]);

  const downloadImage = () => {
    alert('ダウンロード機能は実装中です');
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f8f9fa', 
      borderRadius: '8px', 
      fontFamily: 'sans-serif',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>
        🎨 Icon Customizer (Simple)
      </h2>
      
      <div style={{ marginBottom: '20px', color: '#4a5568' }}>
        {message}
      </div>

      {/* プレビューエリア */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: shape === 'circle' ? '50%' : '10px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white',
            margin: '0 auto',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          🎯
        </div>
      </div>

      {/* コントロールパネル */}
      <div style={{ display: 'grid', gap: '15px' }}>
        
        {/* 形状選択 */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            形状:
          </label>
          <button
            onClick={() => setShape('circle')}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: shape === 'circle' ? '#3b82f6' : '#e2e8f0',
              color: shape === 'circle' ? 'white' : '#4a5568',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ⚪ 円形
          </button>
          <button
            onClick={() => setShape('square')}
            style={{
              padding: '8px 16px',
              backgroundColor: shape === 'square' ? '#3b82f6' : '#e2e8f0',
              color: shape === 'square' ? 'white' : '#4a5568',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ⬜ 四角
          </button>
        </div>

        {/* サイズ調整 */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            サイズ: {size}px
          </label>
          <input
            type="range"
            min="50"
            max="200"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        {/* 色選択 */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            背景色:
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ 
              width: '50px', 
              height: '30px', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
          <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666' }}>
            {color}
          </span>
        </div>

        {/* ダウンロードボタン */}
        <button
          onClick={downloadImage}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
        >
          📥 アイコンをダウンロード
        </button>
      </div>

      {/* デバッグ情報 */}
      {instanceConfig && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#e2e8f0', 
          borderRadius: '4px',
          fontSize: '12px',
          color: '#4a5568'
        }}>
          <strong>デバッグ情報:</strong><br/>
          Instance ID: {instanceConfig.instanceId}<br/>
          Plugin URL: {instanceConfig.pluginUrl}<br/>
          Base Image: {instanceConfig.baseImageUrl}
        </div>
      )}
    </div>
  );
};

export default SimpleApp;