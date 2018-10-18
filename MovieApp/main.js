const {app, BrowserWindow, ipcMain} = require('electron');
const { sequelize, topRated, nowPlaying, trending, upComing } = require('./src/models');
const Op = sequelize.Op

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL('http://localhost:3000');

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}
function deleteData() {
  console.log('///// deleteing data ////////')
  topRated.destroy({
    where : {
      createdAt : {
        [Op.ne] : null
      }
    }
  })
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })
  nowPlaying.destroy({
    where : {
      createdAt : {
        [Op.ne] : null
      }
    }
  })
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })
  trending.destroy({
    where : {
      createdAt : {
        [Op.ne] : null
      }
    }
  })
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })
  upComing.destroy({
    where : {
      createdAt : {
        [Op.ne] : null
      }
    }
  })
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.log(error)
  })
}

app.on('ready', () => {
  sequelize.sync().then( () => {
    createWindow()
    // deleteData () 
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
          name : e.title || e.original_title,
          movieId : e.id,
          imagePath : e.poster_path,
          overview : e.overview,
          releaseDate : e.release_date,
          rating : e.vote_average || e.rating,
          tagline : e.tagline,
          runtime : e.runtime,
          revenue : e.revenue,
          language : e.original_language
        })
        .then(movie => {
          console.log('/////////// created trending //////////////')
          mainWindow.webContents.send('trendingCreated',movie)
        })
        .catch(error => {
          console.log('////////////// trending create arror ///////////////')
          console.log(error)
        });
      } else {
        mainWindow.webContents.send('trendingCreated', false)
      }
    })
    
  })
})


ipcMain.on('nowPlaying', (e, data) => {
  console.log('/////////********* nowPlaying ********///////////')
  data.forEach(e => {
    nowPlaying.findOne({
      where : {
        movieId : e.id
      }
    })
    .then(movie => {
      if(!movie) {
        console.log('////////******* movie has been added ******/////////')
        return nowPlaying.create({
          name : e.title || e.original_title,
          movieId : e.id,
          imagePath : e.poster_path,
          overview : e.overview,
          releaseDate : e.release_date,
          rating : e.vote_average || e.rating,
          tagline : e.tagline,
          runtime : e.runtime,
          revenue : e.revenue,
          language : e.original_language
        })
        .then(movie => {
          mainWindow.webContents.send('nowPlayingCreated',movie)
        })
        .catch(error => {
          console.log('////////////// nowplaying create arror ///////////////')
          console.log(error)
        });
      } else {
        mainWindow.webContents.send('nowPlayingCreated', false)
      }
    })
    
  })
})
ipcMain.on('topRated', (e, data) => {
  console.log('/////////********* topRated ********///////////')
  data.forEach(e => {
    topRated.findOne({
      where : {
        movieId : e.id
      }
    })
    .then(movie => {
      if(!movie) {
        console.log('////////******* movie has been added ******/////////')
        return topRated.create({
          name : e.title || e.original_title,
          movieId : e.id,
          imagePath : e.poster_path,
          overview : e.overview,
          releaseDate : e.release_date,
          rating : e.vote_average || e.rating,
          tagline : e.tagline,
          runtime : e.runtime,
          revenue : e.revenue,
          language : e.original_language
        })
        .then(movie => {
          mainWindow.webContents.send('topRatedCreated',movie)
        })
        .catch(error => {
          console.log('////////////// toprated create arror ///////////////')
          console.log(error)
        });
      } else {
        mainWindow.webContents.send('topRatedCreated', false)
      }
    })
    
  })
})
ipcMain.on('upComing', (e, data) => {
  console.log('/////////********* upcoming ********///////////')
  data.forEach(e => {
    upComing.findOne({
      where : {
        movieId : e.id
      }
    })
    .then(movie => {
      if(!movie) {
        console.log('////////******* movie has been added ******/////////')
        return upComing.create({
          name : e.title || e.original_title,
          movieId : e.id,
          imagePath : e.poster_path,
          overview : e.overview,
          releaseDate : e.release_date,
          rating : e.vote_average || e.rating,
          tagline : e.tagline,
          runtime : e.runtime,
          revenue : e.revenue,
          language : e.original_language
        })
        .then(movie => {
          mainWindow.webContents.send('upComingCreated',movie)
        })
        .catch(error => {
          console.log('////////////// upcoming create arror ///////////////')
          console.log(error)
        });
      } else {
        mainWindow.webContents.send('upComingCreated', false)
      }
    })
    
  })
})
ipcMain.on('trendingFind', (e, data) => {
  console.log('//////// trending findall //////////')
  if(data) {
    let result
    let total
    trending.count()
    .then(count => {
      total = count
      return  trending.findAll({
        limit : 20,
        offset: (data.page - 1) * 20
      })
    })
    .then(trending => {
      result = {
        count : total,
        data : trending
      }
      mainWindow.webContents.send('trendingData', result)
    })
    .catch(error => {
      console.log('////////////// trending findall arror ///////////////')
      console.log(error)
    })
  }
})
ipcMain.on('topRatedFind', (e, data) => {
  console.log('//////// topRated findall //////////')
  if(data) {
    let result
    let total
    topRated.count()
    .then(count => {
      total = count
      return  topRated.findAll({
        limit : 20,
        offset: (data.page - 1) * 20
      })
    })
    .then(topRated => {
      result = {
        count : total,
        data : topRated
      }
      mainWindow.webContents.send('topRatedData', result)
    })
    .catch(error => {
      console.log('////////////// toprated findall arror ///////////////')
      console.log(error)
    })
  }
})
ipcMain.on('nowPlayingFind', (e, data) => {
  console.log('//////// nowPlaying findall //////////')
  if(data) {
    let result
    let total
    nowPlaying.count()
    .then(count => {
      total = count
      return nowPlaying.findAll({
        limit : 20,
        offset: (data.page - 1) * 20
      })
    })
    .then(nowPlaying => {
      result = {
        data : nowPlaying,
        count : total
      }
      mainWindow.webContents.send('nowPlayingData', result)
    })
    .catch(error => {
      console.log('////////////// noplaying findall arror ///////////////')
      console.log(error)
    })
  }
})
ipcMain.on('upComingFind', (e, data) => {
  console.log('//////// upComing findall //////////')
  if(data) {
    let result
    let total
    upComing.count()
    .then(count => {
      total = count
      return  upComing.findAll({
        limit : 20,
        offset: (data.page - 1) * 20
      })
    })
    .then(upComing => {
      result = {
        count : total,
        data : upComing
      }
      mainWindow.webContents.send('upComingData', result)
    })
    .catch(error => {
      console.log('////////////// upcoming findall arror ///////////////')
      console.log(error)
    })
  }
})

ipcMain.on('findMovieDetails', async (e, data) => {
  const trendingDetails = await trending.find({ 
    where : { movieId : data.id}
  });
  const topRatedDetails = await topRated.find({ 
    where : { movieId : data.id}
  });
  const nowPlayingDetails = await nowPlaying.find({ 
    where : { movieId : data.id}
  });
  const upComingDetails = await upComing.find({ 
    where : { movieId : data.id}
  });
  (Object.keys(trendingDetails).length !== 0 ? mainWindow.webContents.send('movieDetails', trendingDetails) : null) 
  (Object.keys(topRatedDetails).length !== 0 ? mainWindow.webContents.send('movieDetails', topRatedDetails) : null)  
  (Object.keys(nowPlayingDetails).length !== 0 ? mainWindow.webContents.send('movieDetails', nowPlayingDetails) : null)  
  (Object.keys(upComingDetails).length !== 0 ? mainWindow.webContents.send('movieDetails', upComingDetails) : null)    

})

ipcMain.on('getData', async(e, data) => {
  let array1
  let array2
  const trendingArr = await trending.findAll({
    attributes : ['name','movieId']
  })
  const topRatedArr = await topRated.findAll({
    attributes : ['name','movieId']
  })
  const nowPlayingArr = await nowPlaying.findAll({
    attributes : ['name','movieId']
  })
  const upComingArr = await upComing.findAll({
    attributes : ['name','movieId']
  })
  array1 = trendingArr.concat(topRatedArr)
  array2 = nowPlayingArr.concat(upComingArr)
  let result = array1.concat(array2)
  mainWindow.webContents.send('searchData', result)
})