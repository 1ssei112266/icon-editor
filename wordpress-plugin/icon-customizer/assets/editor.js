// ブロックエディター用のJavaScript
(function() {
    // ショートコードブロックにプレビュー機能を追加
    wp.domReady(function() {
        // ショートコードの変更を監視
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // Icon Customizerショートコードを含むブロックを検索
                    const shortcodeBlocks = document.querySelectorAll('.wp-block-shortcode');
                    shortcodeBlocks.forEach(function(block) {
                        const textarea = block.querySelector('textarea');
                        if (textarea && textarea.value.includes('[icon_customizer')) {
                            // プレビューが既に存在しない場合のみ追加
                            if (!block.querySelector('.icon-customizer-editor-preview')) {
                                const preview = document.createElement('div');
                                preview.className = 'icon-customizer-editor-preview';
                                preview.innerHTML = `
                                    <div style="border: 2px dashed #f48fb1; padding: 15px; text-align: center; background: #fce4ec; border-radius: 8px; margin-top: 10px;">
                                        <span style="color: #ad1457; font-weight: 600;">📱 Icon Customizer</span><br>
                                        <small style="color: #ad1457;">このショートコードはフロントエンドで表示されます</small>
                                    </div>
                                `;
                                block.appendChild(preview);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();