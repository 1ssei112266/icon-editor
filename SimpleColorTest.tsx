import React, { useState } from 'react';

// 超シンプル：2ボタンのみの色変更テスト
const SimpleColorTest: React.FC = () => {
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🎨 超シンプル色変更テスト</h2>
      
      {/* 色が変わるボックス */}
      <div
        style={{
          width: '200px',
          height: '200px',
          backgroundColor: bgColor,
          border: '5px solid #000',
          borderRadius: '10px',
          margin: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: bgColor === '#ffffff' ? '#000' : '#fff',
        }}
      >
        現在: {bgColor}
      </div>
      
      {/* 2つのボタンのみ */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <button
          onClick={() => {
            console.log('🔴 赤に変更');
            setBgColor('#ff0000');
          }}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#ff0000',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          赤にする
        </button>
        
        <button
          onClick={() => {
            console.log('🔵 青に変更');
            setBgColor('#0000ff');
          }}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#0000ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          青にする
        </button>
      </div>
      
      {/* 結果表示 */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        fontSize: '16px'
      }}>
        <strong>テスト結果:</strong><br/>
        現在の色: <strong>{bgColor}</strong><br/>
        {bgColor === '#ffffff' && '⚪ 初期状態（白）'}
        {bgColor === '#ff0000' && '🔴 赤ボタンが動作しました！'}
        {bgColor === '#0000ff' && '🔵 青ボタンが動作しました！'}
      </div>
    </div>
  );
};

export default SimpleColorTest;