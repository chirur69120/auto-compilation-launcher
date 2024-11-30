const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Force development mode
  process.env.NODE_ENV = 'development';

  // Try to connect to the Vite dev server
  const tryConnection = () => {
    win.loadURL('http://localhost:5173').catch(() => {
      console.log('Retrying connection to Vite dev server...');
      setTimeout(tryConnection, 1000);
    });
  };
  tryConnection();

  // Open DevTools in development
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});