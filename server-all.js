const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3004;
const versionDateMap = require('./version_date_map.json');

// 處理所有請求
app.use((req, res, next) => {
    // 如果是請求 loading.html 本身，直接返回
    if (req.path === '/loading.html') {
        return next();
    }

    // 如果是請求 index.html，導向對應版本首頁
    if (req.path === '/index.html') {
        const todayVersion = getTodayVersion();
        const dateStr = getTaiwanDateStr();
        console.log('台灣日期:', dateStr, '對應版本:', todayVersion, '(for /index.html)');
        if (todayVersion) {
            return res.sendFile(path.join(__dirname, 'public-all', todayVersion, 'index.html'));
        } else {
            return res.status(404).send('今日無對應版本');
        }
    }

    // 其他請求繼續處理
    next();
});

function getTaiwanDateStr() {
    // 直接用 toLocaleString 取得台灣日期 yyyy-mm-dd
    const now = new Date();
    const taiwanDate = now.toLocaleString('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' });
    // 轉成 yyyy-mm-dd
    return taiwanDate.split(',')[0];
}

function getTodayVersion() {
    const dateStr = getTaiwanDateStr();
    return versionDateMap[dateStr] || null;
}

// 主要路由處理
app.get('/', (req, res) => {
    const todayVersion = getTodayVersion();
    const dateStr = getTaiwanDateStr();
    console.log('台灣日期:', dateStr, '對應版本:', todayVersion);
    if (todayVersion) {
        // 直接顯示對應版本首頁
        res.sendFile(path.join(__dirname, 'public-all', todayVersion, 'index.html'));
    } else {
        res.status(404).send('今日無對應版本');
    }
});

const versionPrefixes = [
  'studio-alphonse', // v1
  'casa',            // v2
  'oh',              // v3
  'interior',        // v4
  'nite',            // v5
  'qudrix',          // v6
  'atlaslogie',      // v7
  'siena',           // v8
  'soscale',         // v9
  'mirko',           // v10
  'yellow',          // v11
  'showcase',        // v12
  'moonbase',        // v13
  'otherlife',       // v14
  'moooor',          // v15
  'coinsetters',     // v16
  'cask',            // v17
  'dropbox',         // v18
  'uncommon'         // v19
];

// 處理 /v:version/:prefix 路由
app.get('/v:version/:prefix', (req, res) => {
    const version = parseInt(req.params.version);
    const prefix = req.params.prefix;
    if (version >= 1 && version <= 19 && prefix === versionPrefixes[version - 1]) {
        res.sendFile(path.join(__dirname, 'public-all', `v${version}`, 'index.html'));
    } else {
        res.status(404).send('版本或前綴不存在');
    }
});

// 處理版本路由（保留原本的 /v:version 進入點）
app.get('/v:version', (req, res) => {
    const version = parseInt(req.params.version);
    if (version >= 1 && version <= 19) {
        res.sendFile(path.join(__dirname, 'public-all', `v${version}`, 'index.html'));
    } else {
        res.status(404).send('版本不存在');
    }
});

// 處理版本相關的靜態資源
app.get('/v:version/*', (req, res) => {
    const version = parseInt(req.params.version);
    if (version >= 1 && version <= 19) {
        const filePath = req.path.replace(`/v${version}`, '');
        res.sendFile(path.join(__dirname, 'public-all', `v${version}`, filePath));
    } else {
        res.status(404).send('版本不存在');
    }
});

const cardPages = [
  'studio-alphonse', 'casa', 'oh', 'interior', 'nite', 'qudrix', 'atlaslogie',
  'siena', 'soscale', 'mirko', 'yellow', 'showcase', 'moonbase', 'otherlife',
  'moooor', 'coinsetters', 'cask', 'dropbox', 'uncommon'
];

app.get('/:card', (req, res, next) => {
  const card = req.params.card;
  if (cardPages.includes(card)) {
    const filePath = path.join(__dirname, 'public-all', `${card}.html`);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  next();
});

// 最後才設置靜態文件目錄
app.use(express.static(path.join(__dirname, 'public-all')));

// 啟動服務器
app.listen(port, () => {
    console.log(`服務器運行在 http://localhost:${port}`);
    console.log('版本路由系統已啟動');
}); 