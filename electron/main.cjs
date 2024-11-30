const { app, BrowserWindow } = require('electron');
const path = require('path');
const waitOn = require('wait-on');

async function createWindow() {
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

  // Wait for the Vite dev server to start
  try {
    await waitOn({
      resources: ['http://localhost:5173'],
      timeout: 5000, // 5 seconds timeout
      validateStatus: function (status) {
        return status >= 200 && status < 300;
      }
    });
    
    await win.loadURL('http://localhost:5173');
  } catch (error) {
    console.error('Failed to connect to Vite dev server:', error);
    process.exit(1);
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});