// 手工打包成 Windows exe：复用已安装的 electron 运行时，零下载。
// 结构：<输出目录>/electron.exe -> 改名 -> 运行时会加载 resources/app 里的课件。
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const electronDist = path.join(dir, 'node_modules', 'electron', 'dist');
const outDir = path.join(dir, 'dist', '扣好人生第一粒扣子-Windows版');

if (!fs.existsSync(electronDist)) {
  console.error('❌ 找不到 electron 运行时：' + electronDist);
  console.error('   请先运行 npm install 安装 electron。');
  process.exit(1);
}

// 递归复制目录
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// 清空重建
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, 'resources', 'app'), { recursive: true });

// 1) 复制 electron 运行时（electron.exe / dll / locales / resources 等）
copyDir(electronDist, outDir);

// 2) 把课件放进 resources/app（electron 启动时会优先加载这里）
const appFiles = ['main.js', 'index.html', 'styles.css', 'renderer.js', 'package.json'];
for (const f of appFiles) {
  fs.copyFileSync(path.join(dir, f), path.join(outDir, 'resources', 'app', f));
}

// 3) electron.exe 改名成课件名（exe 文件名不影响运行，resources 按所在目录定位）
fs.renameSync(path.join(outDir, 'electron.exe'), path.join(outDir, '扣好人生第一粒扣子.exe'));

console.log('✅ 已生成 exe 文件夹：' + outDir);
console.log('   双击里面的「扣好人生第一粒扣子.exe」即可运行。');
