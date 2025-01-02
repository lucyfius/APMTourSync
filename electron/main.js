const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Database = require('./database');
const UpdateHandler = require('./updater');

let mainWindow;
let db;
let updateHandler;

async function createWindow() {
  try {
    // Initialize database
    db = new Database();
    await db.connect();

    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        sandbox: false
      }
    });

    if (isDev) {
      console.log('Loading development URL...');
      await mainWindow.loadURL('http://localhost:3000');
      mainWindow.webContents.openDevTools();
    } else {
      console.log('Loading production build...');
      await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load:', errorCode, errorDescription);
    });

    // Initialize update handler
    updateHandler = new UpdateHandler(mainWindow);

    setupIpcHandlers();
  } catch (error) {
    console.error('Error during window creation:', error);
    dialog.showErrorBox('Initialization Error', error.message);
  }
}

function setupIpcHandlers() {
  // Database operations
  ipcMain.handle('db:getTours', async () => {
    try {
      const tours = await db.getTours();
      return tours;
    } catch (error) {
      console.error('IPC getTours error:', error);
      throw error;
    }
  });
  ipcMain.handle('db:createTour', (_, tour) => db.createTour(tour));
  ipcMain.handle('db:updateTour', (_, id, tour) => db.updateTour(id, tour));
  ipcMain.handle('db:deleteTour', (_, id) => db.deleteTour(id));

  ipcMain.handle('db:getProperties', () => db.getProperties());
  ipcMain.handle('db:createProperty', (_, property) => db.createProperty(property));
  ipcMain.handle('db:updateProperty', (_, id, property) => db.updateProperty(id, property));
  ipcMain.handle('db:deleteProperty', (_, id) => db.deleteProperty(id));

  ipcMain.handle('db:getSettings', () => db.getSettings());
  ipcMain.handle('db:updateSettings', (_, settings) => db.updateSettings(settings));

  // Window controls
  ipcMain.on('app:minimize', () => mainWindow.minimize());
  ipcMain.on('app:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on('app:close', () => mainWindow.close());

  // Updates
  ipcMain.on('updates:check', () => {
    updateHandler.checkForUpdates();
  });
}

// App lifecycle
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 