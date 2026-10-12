const { app, BrowserWindow } = require('electron');
const path = require('path');

// 部分 Windows 电脑上，硬件加速会导致毛玻璃(backdrop-filter)白屏/闪屏/卡死。
// 这里关闭硬件加速换取稳定（课件动画很轻，软件渲染足够流畅）。
app.disableHardwareAcceleration();

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    autoHideMenuBar: true,
    backgroundColor: '#1a1033',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // 把页面里的报错打印到终端，方便排查问题
  win.webContents.on('console-message', (event, level, message) => {
    console.log('[页面]', message);
  });
  win.webContents.on('did-fail-load', (event, code, desc) => {
    console.error('页面加载失败：', code, desc);
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
