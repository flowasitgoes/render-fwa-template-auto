const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// commit hash 與版型名稱對應
const commits = [
  { hash: "cf131ca", name: "Studio-Alphonse" },
  { hash: "35bc3a3", name: "Casa Lunara" },
  { hash: "6753ab3", name: "OH Architecture" },
  { hash: "8808a1d", name: "Interior Design" },
  { hash: "f155661", name: "Nite Riot" },
  { hash: "ecc6ce8", name: "Qudrix" },
  { hash: "740c0d2", name: "Atlaslogie" },
  { hash: "082d869", name: "Siena Film Foundation" },
  { hash: "5ea4be1", name: "SoScale" },
  { hash: "b4420bb", name: "Mirko Romanelli" },
  { hash: "e15beac", name: "Yellow Fellow" },
  { hash: "81510d3", name: "Showcase" },
  { hash: "7ec257e", name: "Moonbase" },
  { hash: "eaeb0a2", name: "Otherlife Labs" },
  { hash: "249fea5", name: "MOOOOR" },
  { hash: "c15bb27", name: "Coinsetters" },
  { hash: "278772a", name: "Cask Exchange" },
  { hash: "05fea79", name: "Dropbox Brand Guidelines" },
  { hash: "b24a04f", name: "UNCOMMON" }
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

// 立即切換一次
switchCommit();

// 每天切換一次（24小時 = 86400000 毫秒）
const timer = setInterval(switchCommit, 24 * 60 * 60 * 1000); 
// const timer = setInterval(switchCommit, 60 * 1000);
