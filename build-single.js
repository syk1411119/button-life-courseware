// 把 index.html + styles.css + renderer.js 合并成一个单文件，双击即可用浏览器打开
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'renderer.js'), 'utf8');

let out = html
  // 内联样式
  .replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
  // 内联脚本
  .replace('<script src="renderer.js"></script>', '<script>\n' + js + '\n</script>')
  // 移除为 Electron 加的 CSP（会拦截内联脚本，浏览器里用不到）
  .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\s*/, '');

const outPath = path.join(dir, '课件-单文件版.html');
fs.writeFileSync(outPath, out, 'utf8');
console.log('✅ 已生成：课件-单文件版.html（' + (out.length / 1024).toFixed(1) + ' KB）');
console.log('   双击它，用 Chrome 或 Edge 打开即可。');
