const fs = require('fs');
const path = require('path');

// 讀取模板和卡片數據
const template = fs.readFileSync('public-all/index.html', 'utf8');
const cards = JSON.parse(fs.readFileSync('card-templates.json', 'utf8')).cards;

// 生成每個版本的 index.html
for (let i = 1; i <= 19; i++) {
    // 創建版本目錄
    const versionDir = path.join('public-all', `v${i}`);
    if (!fs.existsSync(versionDir)) {
        fs.mkdirSync(versionDir, { recursive: true });
    }

    // 生成當前版本要顯示的卡片 HTML
    const cardsHTML = cards
        .slice(0, i)
        .map(card => `
            <div class="${card.class}" style="--animation-order: ${card.animationOrder}" data-title="${card.title}">
                <a href="${card.link}">${card.text}</a>
            </div>
        `)
        .join('\n');

    // 替換模板中的卡片部分
    const versionHTML = template.replace(
        /<div class="grid template-works">[\s\S]*?<\/div>\s*<\/div>/,
        `<div class="grid template-works">\n${cardsHTML}\n        </div>\n    </div>`
    );

    // 寫入檔案
    fs.writeFileSync(path.join(versionDir, 'index.html'), versionHTML);
    console.log(`Generated v${i}/index.html`);
} 