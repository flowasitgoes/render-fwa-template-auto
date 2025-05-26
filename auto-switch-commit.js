const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// commit hash 與版型名稱對應
const commits = [
  { hash: "663711b", name: "Studio-Alphonse" },
  { hash: "fb5e5e3", name: "Casa Lunara" },
  { hash: "578b5e7", name: "OH Architecture" },
  { hash: "9e519f1", name: "Interior Design" },
  { hash: "ac921c7", name: "Nite Riot" },
  { hash: "c3053ef", name: "Qudrix" },
  { hash: "122ceed", name: "Atlaslogie" },
  { hash: "64cfa2b", name: "Siena Film Foundation" },
  { hash: "dcb0565", name: "SoScale" },
  { hash: "50f2b06", name: "Mirko Romanelli" },
  { hash: "9f94ba6", name: "Yellow Fellow" },
  { hash: "ae948f9", name: "Showcase" },
  { hash: "72d0519", name: "Moonbase" },
  { hash: "d47ec65", name: "Otherlife Labs" },
  { hash: "b01e0b7", name: "MOOOOR" },
  { hash: "e059219", name: "Coinsetters" },
  { hash: "b69a6b6", name: "Cask Exchange" },
  { hash: "d5e84c0", name: "Dropbox Brand Guidelines" },
  { hash: "a7f69d5", name: "UNCOMMON" }
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
