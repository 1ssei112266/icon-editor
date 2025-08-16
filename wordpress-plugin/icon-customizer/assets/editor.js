/**
 * Icon Customizer エディター拡張JavaScript
 * 
 * このファイルはWordPressブロックエディター内でのみ動作し、
 * Icon Customizerプラグインのエディター機能を拡張します。
 * 
 * 主な機能:
 * 1. エディター初期化処理
 * 2. 将来的な機能拡張の基盤
 * 3. プレビューの動的制御（必要に応じて）
 * 
 * 依存関係:
 * - wp-blocks (WordPress Block Editor API)
 * - wp-element (React-like elements)
 * - wp-editor (Editor utilities)
 * 
 * 読み込み条件:
 * - enqueue_block_editor_assets アクションでのみ読み込み
 * - 投稿・固定ページ編集画面でのみ有効
 * 
 * 最終更新: 2025-08-16
 */

// 即座に実行される無名関数でスコープを分離
(function() {
    'use strict';
    
    /**
     * DOM読み込み完了時の初期化処理
     * 
     * エディターが完全に読み込まれた後に実行される処理。
     * 現在は基本的な初期化のみだが、将来的な機能拡張に備えて準備。
     */
    function initializeIconCustomizerEditor() {
        
        // デバッグ用ログ出力（開発時のみ）
        if (typeof console !== 'undefined' && console.log) {
            console.log('Icon Customizer Editor: 初期化開始');
        }
        
        // ===== エディター設定の確認 =====
        // wp_localize_script で渡された設定を確認
        if (typeof iconCustomizerEditor !== 'undefined') {
            
            // 設定情報をログ出力（開発・デバッグ用）
            if (typeof console !== 'undefined' && console.log) {
                console.log('Icon Customizer Editor: 設定情報', {
                    pluginUrl: iconCustomizerEditor.pluginUrl,
                    version: iconCustomizerEditor.version,
                    hasNonce: !!iconCustomizerEditor.nonce
                });
            }
            
        } else {
            // 設定が見つからない場合の警告
            if (typeof console !== 'undefined' && console.warn) {
                console.warn('Icon Customizer Editor: 設定情報が見つかりません');
            }
        }
        
        // ===== エディター UI の拡張 =====
        // 現在は最小限の実装
        enhanceEditorInterface();
        
        // 初期化完了ログ
        if (typeof console !== 'undefined' && console.log) {
            console.log('Icon Customizer Editor: 初期化完了');
        }
    }
    
    /**
     * エディターインターフェースの拡張
     * 
     * ブロックエディター内での Icon Customizer の使いやすさを向上させる
     * ための UI 拡張機能。現在は基本的な機能のみ実装。
     */
    function enhanceEditorInterface() {
        
        // ===== ショートコードブロックの改善 =====
        // Icon Customizer ショートコードが含まれるブロックの識別と装飾
        
        // MutationObserver でエディター内の変更を監視
        if (typeof MutationObserver !== 'undefined') {
            
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    
                    // 新しく追加されたノードをチェック
                    if (mutation.addedNodes) {
                        
                        for (var i = 0; i < mutation.addedNodes.length; i++) {
                            var node = mutation.addedNodes[i];
                            
                            // 要素ノードの場合のみ処理
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                processNewEditorBlock(node);
                            }
                        }
                    }
                });
            });
            
            // エディター全体を監視対象にする
            var editorContainer = document.querySelector('.block-editor-writing-flow');
            if (editorContainer) {
                observer.observe(editorContainer, {
                    childList: true,    // 子要素の追加・削除を監視
                    subtree: true       // 孫要素以下も監視
                });
                
                // 既存のブロックも処理
                processExistingBlocks(editorContainer);
            }
        }
    }
    
    /**
     * 新しく追加されたエディターブロックの処理
     * 
     * エディター内で新しくブロックが追加された際に、
     * Icon Customizer 関連のブロックかどうかをチェックし、
     * 必要に応じて特別な処理を行う。
     * 
     * @param {Element} blockElement 新しく追加されたブロック要素
     */
    function processNewEditorBlock(blockElement) {
        
        // ショートコードブロック内で icon_customizer を含むものを探す
        var shortcodeBlocks = blockElement.querySelectorAll('[data-type="core/shortcode"]');
        
        for (var i = 0; i < shortcodeBlocks.length; i++) {
            var block = shortcodeBlocks[i];
            var textContent = block.textContent || '';
            
            // icon_customizer ショートコードが含まれているかチェック
            if (textContent.indexOf('icon_customizer') !== -1) {
                
                // ブロックに識別用のクラスを追加
                block.classList.add('icon-customizer-shortcode-block');
                
                // デバッグ用ログ
                if (typeof console !== 'undefined' && console.log) {
                    console.log('Icon Customizer Editor: ショートコードブロックを検出', block);
                }
                
                // ===== 将来的な機能拡張エリア =====
                // - ブロックツールバーにカスタムボタン追加
                // - プレビューの動的更新
                // - 設定パネルの表示
                // 等の機能をここに追加可能
            }
        }
    }
    
    /**
     * 既存のエディターブロックの処理
     * 
     * ページ読み込み時に既に存在するブロックに対して、
     * Icon Customizer 関連の処理を適用する。
     * 
     * @param {Element} container エディターのコンテナ要素
     */
    function processExistingBlocks(container) {
        
        // 既存のショートコードブロックをすべて取得
        var existingBlocks = container.querySelectorAll('[data-type="core/shortcode"]');
        
        for (var i = 0; i < existingBlocks.length; i++) {
            processNewEditorBlock(existingBlocks[i]);
        }
    }
    
    // ===== メイン実行部分 =====
    
    /**
     * エディター読み込み完了の検出とイベント登録
     * 
     * WordPress のエディター読み込み完了を適切に検出し、
     * 初期化処理を実行する。複数の検出方法を用意して確実性を高める。
     */
    
    // 方法1: DOMContentLoaded イベント
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIconCustomizerEditor);
    } else {
        // 既に読み込み完了している場合は即座に実行
        initializeIconCustomizerEditor();
    }
    
    // 方法2: WordPress エディター固有のイベント（存在する場合）
    if (typeof wp !== 'undefined' && wp.domReady) {
        wp.domReady(initializeIconCustomizerEditor);
    }
    
    // 方法3: 一定時間後の再確認（フォールバック）
    setTimeout(function() {
        
        // エディターが存在するかチェック
        var editor = document.querySelector('.block-editor-writing-flow');
        
        if (editor && !editor.hasAttribute('data-icon-customizer-initialized')) {
            
            // 初期化マークを付けて重複実行を防ぐ
            editor.setAttribute('data-icon-customizer-initialized', 'true');
            
            // 初期化実行
            initializeIconCustomizerEditor();
        }
        
    }, 1000);  // 1秒後に確認
    
})();  // 即座実行関数の終了

/**
 * グローバル関数の定義
 * 
 * デバッグや外部からのアクセスが必要な場合に備えて、
 * いくつかの機能をグローバルスコープに公開。
 */

// デバッグ用のグローバルオブジェクト
window.iconCustomizerEditorDebug = {
    
    /**
     * 現在のエディター状態を出力
     */
    getEditorState: function() {
        return {
            hasEditor: !!document.querySelector('.block-editor-writing-flow'),
            hasConfig: typeof iconCustomizerEditor !== 'undefined',
            shortcodeBlocks: document.querySelectorAll('.icon-customizer-shortcode-block').length,
            timestamp: new Date().toISOString()
        };
    },
    
    /**
     * 強制的に初期化を再実行
     */
    reinitialize: function() {
        if (typeof console !== 'undefined' && console.log) {
            console.log('Icon Customizer Editor: 手動再初期化を実行');
        }
        // 再初期化ロジックをここに実装
    }
};