const {app, BrowserWindow, ipcMain} = require('electron');
const { sequelize, topRated, nowPlaying, trending, upComing } = require('./src/models');

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
  sequelize.sync().then( () => {
    createWindow();
  });
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

ipcMain.on('trending', (e, data) => {
  console.log('/////////********* trending ********///////////')
  data.forEach(e => {
    trending.findOne({
      where : {
        movieId : e.id
      }
    })
    .then(movie => {
      if(!movie) {
        console.log('////////******* movie has been added ******/////////')
        return trending.create({
          name : e.title,
          movieId : e.id,
          imagePath : e.poster_path,
          overview : e.overview,
          releaseDate : e.release_date,
          rating : e.vote_average
        })
      }
    })
    .then(movie => {
      mainWindow.webContents.send('trendingCreated',movie)
    })
    .catch(error => {
      console.log(error)
    });
  })
})
ipcMain.on('nowPlaying', (e, data) => {
  nowPlaying.create({
    name : data.title,
    movieId : data.id,
    imagePath : data.poster_path,
    overview : data.overview,
    releaseDate : data.release_date,
    rating : data.vote_average
  })
  .then(movie => {
    mainWindow.webContents.send('nowPlayingCreated',movie)
  })
})
ipcMain.on('upComing', (e, data) => {
  upComing.create({
    name : data.title,
    movieId : data.id,
    imagePath : data.poster_path,
    overview : data.overview,
    releaseDate : data.release_date,
    rating : data.vote_average
  })
  .then(movie => {
    mainWindow.webContents.send('upComingCreated',movie)
  })
})
ipcMain.on('topRated', (e, data) => {
  topRated.create({
    name : data.title,
    movieId : data.id,
    imagePath : data.poster_path,
    overview : data.overview,
    releaseDate : data.release_date,
    rating : data.vote_average
  })
  .then(movie => {
    mainWindow.webContents.send('topRatedCreated',movie)
  })
})