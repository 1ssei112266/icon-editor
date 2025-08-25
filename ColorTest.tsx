import React, { useState, useEffect } from 'react';

// 色変更テスト用の最小限コンポーネント
const ColorTest: React.FC = () => {
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  
  const colors = [
    '#ffffff', // 白
    '#ef4444', // 赤
    '#3b82f6', // 青
    '#10b981', // 緑
    '#f59e0b', // 黄
    '#8b5cf6', // 紫
  ];

  // 🔥 WordPress環境での最強CSS強制適用
  useEffect(() => {
    // 1. IDで直接要素を取得してスタイル適用
    const testBox = document.getElementById('color-test-box');
    if (testBox) {
      testBox.style.backgroundColor = bgColor;
      testBox.style.background = bgColor;
      console.log('🎯 直接DOM操作で色変更:', bgColor);
    }

    // 2. 動的CSSルール注入
    const styleId = 'color-test-force-style';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
      #color-test-box {
        background-color: ${bgColor} !important;
        background: ${bgColor} !important;
      }
      .color-test-box-class {
        background-color: ${bgColor} !important;
        background: ${bgColor} !important;
      }
    `;
    
    console.log('💪 CSS強制ルール注入:', bgColor);
  }, [bgColor]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🎨 色変更テスト - 最強版</h2>
      
      {/* 方法1: 通常のReactスタイル */}
      <div
        style={{
          width: '150px',
          height: '100px',
          backgroundColor: bgColor,
          border: '3px solid #333',
          borderRadius: '8px',
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          color: bgColor === '#ffffff' ? '#333' : '#fff',
        }}
      >
        方法1: React style
      </div>
      
      {/* 方法2: ID + CSS強制適用 */}
      <div
        id="color-test-box"
        className="color-test-box-class"
        style={{
          width: '150px',
          height: '100px',
          border: '3px solid #333',
          borderRadius: '8px',
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          color: bgColor === '#ffffff' ? '#333' : '#fff',
        }}
      >
        方法2: ID + CSS強制
      </div>

      {/* 方法3: インラインスタイル文字列 */}
      <div
        style={{
          width: '150px',
          height: '100px',
          border: '3px solid #333',
          borderRadius: '8px',
          margin: '10px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          color: bgColor === '#ffffff' ? '#333' : '#fff',
        }}
        // @ts-ignore
        style={`background-color: ${bgColor}; background: ${bgColor};`}
      >
        方法3: 文字列style
      </div>
      
      {/* 色選択ボタン */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '20px 0' }}>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => {
              console.log('🔄 色変更開始:', color);
              setBgColor(color);
            }}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: color,
              border: bgColor === color ? '3px solid #333' : '2px solid #ccc',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </div>
      
      {/* デバッグ情報 */}
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <strong>🧪 テスト結果:</strong><br/>
        現在のbgColor: <strong>{bgColor}</strong><br/>
        どの方法で色が変わりましたか？<br/>
        ・方法1: React通常スタイル<br/>
        ・方法2: ID + CSS強制適用<br/>
        ・方法3: インライン文字列<br/>
      </div>
    </div>
  );
};

export default ColorTest;