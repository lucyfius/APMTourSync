const { autoUpdater } = require('electron-updater');
const { app, dialog } = require('electron');
const log = require('electron-log');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Configure updater options
autoUpdater.autoDownload = false;
autoUpdater.allowDowngrade = false;

class UpdateHandler {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;

    // Handle update events
    autoUpdater.on('checking-for-update', () => {
      this.sendStatusToWindow('Checking for updates...');
    });

    autoUpdater.on('update-available', (info) => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: `Version ${info.version} is available. Would you like to download it now?`,
        buttons: ['Yes', 'No']
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
    });

    autoUpdater.on('update-not-available', () => {
      this.sendStatusToWindow('Up to date.');
    });

    autoUpdater.on('error', (err) => {
      this.sendStatusToWindow(`Error in auto-updater: ${err.message}`);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      this.sendStatusToWindow(
        `Downloading... ${Math.round(progressObj.percent)}%`
      );
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded. The application will restart to install the update.',
        buttons: ['Restart']
      }).then(() => {
        autoUpdater.quitAndInstall(false, true);
      });
    });
  }

  sendStatusToWindow(text) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('update-status', text);
    }
  }

  checkForUpdates() {
    autoUpdater.checkForUpdates();
  }
}

module.exports = UpdateHandler; 