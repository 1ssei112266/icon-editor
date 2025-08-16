/**
 * Icon Customizer シンプルカスタムブロック
 * 
 * 最低限の機能:
 * 1. 画像ドラッグ&ドロップ
 * 2. 画像URL入力
 * 3. ショートコード出力
 */

const { registerBlockType } = wp.blocks;
const { createElement, useState } = wp.element;
const { TextControl, Button } = wp.components;
const { useBlockProps, MediaUpload } = wp.blockEditor;

registerBlockType('icon-customizer/icon-block', {
    title: 'Icon Customizer',
    description: 'アイコンをカスタマイズできるブロックです',
    icon: 'art',
    category: 'media',
    
    attributes: {
        imageUrl: {
            type: 'string',
            default: ''
        }
    },
    
    edit: function(props) {
        const { attributes, setAttributes } = props;
        const { imageUrl } = attributes;
        const blockProps = useBlockProps();
        
        // ドラッグ&ドロップハンドラー
        const handleDrop = function(e) {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files && files[0] && files[0].type.startsWith('image/')) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = function(event) {
                    setAttributes({ imageUrl: event.target.result });
                };
                reader.readAsDataURL(file);
            }
        };
        
        const handleDragOver = function(e) {
            e.preventDefault();
        };
        
        // メディアライブラリ選択
        const handleMediaSelect = function(media) {
            if (media && media.url) {
                setAttributes({ imageUrl: media.url });
            }
        };
        
        return createElement('div', blockProps,
            // ヘッダー
            createElement('div', {
                style: {
                    background: '#667eea',
                    color: 'white',
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }
            }, '🎨 Icon Customizer'),
            
            // URL入力
            createElement(TextControl, {
                label: '画像URL',
                value: imageUrl,
                onChange: function(newUrl) {
                    setAttributes({ imageUrl: newUrl });
                },
                placeholder: 'https://example.com/icon.png'
            }),
            
            // メディアライブラリボタン
            createElement(MediaUpload, {
                onSelect: handleMediaSelect,
                allowedTypes: ['image'],
                render: function(renderProps) {
                    return createElement(Button, {
                        onClick: renderProps.open,
                        variant: 'secondary',
                        style: { margin: '10px 0' }
                    }, 'メディアライブラリから選択');
                }
            }),
            
            // ドラッグ&ドロップエリア
            createElement('div', {
                style: {
                    border: '2px dashed #ccc',
                    padding: '20px',
                    textAlign: 'center',
                    minHeight: '100px',
                    background: imageUrl ? 'url(' + imageUrl + ') center/contain no-repeat' : '#f9f9f9'
                },
                onDrop: handleDrop,
                onDragOver: handleDragOver
            }, imageUrl ? '' : '📷 画像をドラッグ&ドロップしてください')
        );
    },
    
    save: function(props) {
        const { imageUrl } = props.attributes;
        
        if (imageUrl) {
            return createElement('div', {
                dangerouslySetInnerHTML: {
                    __html: `[icon_customizer image="${imageUrl}"]`
                }
            });
        }
        
        return createElement('div', {
            dangerouslySetInnerHTML: {
                __html: '[icon_customizer]'
            }
        });
    }
});