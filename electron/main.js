const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const log = require('electron-log');

// Development mode check
const isDev = process.env.NODE_ENV === 'development';
if (!isDev) {
  require('dotenv').config({
    path: path.join(process.resourcesPath, '.env')
  });
}
log.info('Environment:', process.env.NODE_ENV);
log.info('Is Development:', isDev);
log.info('Is Packaged:', app.isPackaged);

const Database = require('./database');
const UpdateHandler = require('./updater');

let mainWindow;
let db;
let updateHandler;

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  async function createWindow() {
    try {
      db = new Database();
      await db.connect();

      mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, 'preload.js')
        },
        frame: false,
        icon: path.join(__dirname, '..', 'assets', 'icons', 'icon.ico')
      });

      // Load the app with explicit path resolution
      if (isDev) {
        log.info('Loading development URL');
        await mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
      } else {
        const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
        log.info('Loading production path:', indexPath);
        await mainWindow.loadFile(indexPath);
      }

      updateHandler = new UpdateHandler(mainWindow);
      setupIpcHandlers();
    } catch (error) {
      log.error('Error during window creation:', error);
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
    ipcMain.handle('db:updateTour', async (_, id, tour) => {
      try {
        const result = await db.updateTour(id, tour);
        return result;
      } catch (error) {
        console.error('IPC updateTour error:', error);
        throw error;
      }
    });
    ipcMain.handle('db:deleteTour', (_, id) => db.deleteTour(id));

    ipcMain.handle('db:getProperties', async () => {
      try {
        const properties = await db.getProperties();
        return properties;
      } catch (error) {
        console.error('IPC getProperties error:', error);
        throw error;
      }
    });
    
    ipcMain.handle('db:createProperty', async (_, property) => {
      try {
        const result = await db.createProperty(property);
        return result;
      } catch (error) {
        console.error('IPC createProperty error:', error);
        throw error;
      }
    });

    ipcMain.handle('db:updateProperty', async (_, id, property) => {
      try {
        const result = await db.updateProperty(id, property);
        return result;
      } catch (error) {
        console.error('IPC updateProperty error:', error);
        throw error;
      }
    });
    ipcMain.handle('db:deleteProperty', async (_, id) => {
      try {
        const result = await db.deleteProperty(id);
        return result;
      } catch (error) {
        console.error('IPC deleteProperty error:', error);
        throw error;
      }
    });

    ipcMain.handle('db:getSettings', () => db.getSettings());
    ipcMain.handle('db:updateSettings', (_, settings) => db.updateSettings(settings));

    ipcMain.handle('db:cleanupOldTours', async () => {
      try {
        const result = await db.cleanupOldTours();
        return result;
      } catch (error) {
        console.error('IPC cleanupOldTours error:', error);
        throw error;
      }
    });

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
} 