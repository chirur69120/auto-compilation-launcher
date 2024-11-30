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
    console.log('Waiting for Vite dev server to start...');
    await waitOn({
      resources: ['http://localhost:5173'],
      timeout: 30000, // Augmenté à 30 secondes
      validateStatus: function (status) {
        return status >= 200 && status < 300;
      },
      interval: 1000, // Vérifie toutes les secondes
    });
    
    if (!win.isDestroyed()) {
      console.log('Vite dev server is ready, loading application...');
      await win.loadURL('http://localhost:5173');
    }
  } catch (error) {
    console.error('Failed to connect to Vite dev server:', error);
    if (!win.isDestroyed()) {
      await win.destroy();
    }
    app.quit();
    return;
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development' && !win.isDestroyed()) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  try {
    await createWindow();
  } catch (error) {
    console.error('Failed to create window:', error);
    app.quit();
  }

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      try {
        await createWindow();
      } catch (error) {
        console.error('Failed to create window on activate:', error);
        app.quit();
      }
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});