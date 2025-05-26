const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// commit hash 與版型名稱對應
const commits = [
  { hash: "6364160", name: "Studio-Alphonse" },
  { hash: "e7a5403", name: "Casa Lunara" },
  { hash: "c6cf7da", name: "OH Architecture" },
  { hash: "716fc08", name: "Interior Design" },
  { hash: "1702071", name: "Nite Riot" },
  { hash: "e0961dd", name: "Qudrix" },
  { hash: "11df226", name: "Atlaslogie" },
  { hash: "c25528d", name: "Siena Film Foundation" },
  { hash: "89afe08", name: "SoScale" },
  { hash: "25a8dd2", name: "Mirko Romanelli" },
  { hash: "59929dd", name: "Yellow Fellow" },
  { hash: "32d8a17", name: "Showcase" },
  { hash: "9b31714", name: "Moonbase" },
  { hash: "5649700", name: "Otherlife Labs" },
  { hash: "d4b00e1", name: "MOOOOR" },
  { hash: "c72a415", name: "Coinsetters" },
  { hash: "32e7ff5", name: "Cask Exchange" },
  { hash: "70f57d2", name: "Dropbox Brand Guidelines" },
  { hash: "b2d8a2c", name: "UNCOMMON" }
];


const stateFile = path.join(__dirname, 'commit_state.json');
const recordFile = path.join(__dirname, 'records-of-switch-commits.txt');
let state = { index: 0 };

if (fs.existsSync(stateFile)) {
  state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
}

function getToday() {
  const d = new Date();
  return `${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
}

function writeRecord(index, name) {
  const record = `\n第${index+1}次切換:\n${getToday()}\nFWA - 版型開發 - Templates Collection\n版型${index+1} - ${name}\n#視覺設計  #Branding #UI原型設計 #前後端工程整合\n`;
  fs.appendFileSync(recordFile, record, 'utf-8');
}

function switchCommit() {
  if (state.index < commits.length) {
    const { hash, name } = commits[state.index];
    execSync(`git checkout ${hash}`);
    writeRecord(state.index, name);
    console.log(`已切換到 commit: ${hash}，已寫入紀錄`);
    state.index++;
    fs.writeFileSync(stateFile, JSON.stringify(state), 'utf-8');
  } else {
    console.log('已經切換到最後一個 commit，不再自動切換。');
    clearInterval(timer);
  }
}

function getTaiwanTimeString(date = new Date()) {
  return date.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
}

function getNext9amDate() {
  const now = new Date();
  const nowTW = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
  let next9am = new Date(nowTW);
  next9am.setHours(9, 0, 0, 0);
  if (nowTW.getHours() >= 9) {
    next9am.setDate(next9am.getDate() + 1);
  }
  // 換回 UTC
  return new Date(next9am.getTime() - (nowTW.getTime() - now.getTime()));
}

function switchCommitWithLog() {
  const nowTW = getTaiwanTimeString();
  const next9amTW = getTaiwanTimeString(getNext9amDate());
  switchCommit();
  console.log(`切換時間（台灣）：${nowTW}，下次切換預計：${next9amTW}`);
}

// 啟動時立即切換一次
switchCommitWithLog();

function waitUntilNext9amAndStart() {
  const now = Date.now();
  const next9am = getNext9amDate().getTime();
  const msToNext9am = next9am - now;
  console.log(`距離下次台灣時間9點還有 ${(msToNext9am/1000/60).toFixed(1)} 分鐘`);
  setTimeout(() => {
    switchCommitWithLog();
    setInterval(switchCommitWithLog, 24 * 60 * 60 * 1000); // 之後每24小時執行一次
  }, msToNext9am);
}

waitUntilNext9amAndStart();

// 每天切換一次（24小時 = 86400000 毫秒）
const timer = setInterval(switchCommit, 24 * 60 * 60 * 1000); 
// const timer = setInterval(switchCommit, 60 * 1000);
