const { app, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const isDev = !app.isPackaged;
const devUrl = process.env.SKYNZ_DESKTOP_DEV_URL;
const localBuild = isDev
  ? path.resolve(__dirname, '../frontend/build/index.html')
  : path.join(process.resourcesPath, 'web', 'index.html');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 840, minWidth: 850, minHeight: 600,
    title: 'SKYNZ 3.3 — Creator Control',
    backgroundColor: '#020617',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (event, url) => {
    const allowed = devUrl || pathToFileURL(localBuild).href;
    if (!url.startsWith(allowed.split('#')[0])) {
      event.preventDefault();
      if (/^https:\/\//i.test(url)) shell.openExternal(url);
    }
  });
  if (devUrl) win.loadURL(devUrl);
  else if (fs.existsSync(localBuild)) win.loadFile(localBuild);
  else dialog.showErrorBox('SKYNZ frontend missing', 'Build the frontend before launching the desktop app.');
}
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
