
const {app, BrowserWindow, ipcMain} = require('electron');
// const { sequelize, TodoItemModel } = require('./src/models');

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL('http://localhost:3000');

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', () => {
//   sequelize.sync().then( () => {
// });
    createWindow();
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("searchRequest", (event, data) => {
  console.log('////////////////////////////******* search *******/////////////////////')
  
})
