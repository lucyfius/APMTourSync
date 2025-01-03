const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron', {
    ipcRenderer: {
      invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
      on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      },
      removeListener: (channel, func) => {
        ipcRenderer.removeListener(channel, func);
      }
    }
  }
);

// Expose our safe API
contextBridge.exposeInMainWorld(
  'api', {
    database: {
      getTours: () => ipcRenderer.invoke('db:getTours'),
      createTour: (tour) => ipcRenderer.invoke('db:createTour', tour),
      updateTour: (id, tour) => ipcRenderer.invoke('db:updateTour', id, tour),
      deleteTour: (id) => ipcRenderer.invoke('db:deleteTour', id),
      getProperties: () => ipcRenderer.invoke('db:getProperties'),
      createProperty: (property) => ipcRenderer.invoke('db:createProperty', property),
      updateProperty: (id, property) => ipcRenderer.invoke('db:updateProperty', id, property),
      cleanupOldTours: () => ipcRenderer.invoke('db:cleanupOldTours'),
    },
    app: {
      minimize: () => ipcRenderer.send('app:minimize'),
      maximize: () => ipcRenderer.send('app:maximize'),
      close: () => ipcRenderer.send('app:close')
    }
  }
); 