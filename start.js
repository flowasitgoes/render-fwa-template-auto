const { spawn } = require('child_process');
const path = require('path');

// 啟動 server-all.js
const server = spawn('node', ['server-all.js'], {
    stdio: 'inherit'
});

// 啟動 auto-switch-commit.js
const switcher = spawn('node', ['auto-switch-commit.js'], {
    stdio: 'inherit'
});

// 處理進程退出
process.on('SIGTERM', () => {
    server.kill();
    switcher.kill();
    process.exit(0);
});

// 處理錯誤
server.on('error', (err) => {
    console.error('Server error:', err);
});

switcher.on('error', (err) => {
    console.error('Switcher error:', err);
}); 