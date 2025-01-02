import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 

async function createWindow() {
    try {
      // Initialize database
      db = new Database();
      await db.connect();
    // Create the browser window
      // Create the browser window
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
        frame: false
      });
    // Initialize update handler
      // Initialize update handler
      updateHandler = new UpdateHandler(mainWindow);
    // Load the app
      // Load the app
      if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
      } else {
        mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
      }
    // Handle IPC messages
      setupIpcHandlers();
    } catch (error) {
      console.error('Error during app initialization:', error);
      dialog.showErrorBox('Initialization Error', 
        'Failed to connect to the database. Please check your connection and try again.');
      app.quit();
    }
  }
  