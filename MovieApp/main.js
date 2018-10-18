const {app, BrowserWindow, ipcMain} = require('electron');
const { sequelize, topRated, nowPlaying, trending, upComing, movies } = require('./src/models');
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

ipcMain.on('addMovie', (e, data) => {
  var category = data.category
  console.log('/////////********* trending ********///////////')
  data.array.forEach(e => {
    movies.findOne({
      where : {
        movieId : e.id,
        category : category
      }
    })
    .then(movie => {
      if(!movie) {
        console.log('////////******* movie has been added ******/////////')
        return movies.create({
          category : category,
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
        mainWindow.webContents.send('movieAdded', false)
      }
    })
    
  })
})

ipcMain.on('findMovies', (e, data) => {
  var category = data.category
  console.log('//////// trending findall //////////')
  if(data) {
    let result
    let total
    movies.count({
      where : {
        category : category
      }
    })
    .then(count => {
      console.log('///////////////')
      console.log(count)
      total = count
      return  movies.findAll({
        where : {
          category : category
        },
        limit : 20,
        offset: (data.page - 1) * 20
      })
    })
    .then(trending => {
      console.log(trending)
      result = {
        count : total,
        data : trending
      }
      mainWindow.webContents.send('moviesFound', result)
    })
    .catch(error => {
      console.log('////////////// trending findall arror ///////////////')
      console.log(error)
    })
  }
})


ipcMain.on('findMovieDetails', async (e, data) => {
  const movieDetails = await movies.find ({
    where : {
      movieId : data.id,
    }
  })
  // const trendingDetails = await trending.find({ 
  //   where : { movieId : data.id}
  // });
  // const topRatedDetails = await topRated.find({ 
  //   where : { movieId : data.id}
  // });
  // const nowPlayingDetails = await nowPlaying.find({ 
  //   where : { movieId : data.id}
  // });
  // const upComingDetails = await upComing.find({ 
  //   where : { movieId : data.id}
  // });
  mainWindow.webContents.send('movieDetails', movieDetails)
  // (Object.keys(trendingDetails).length !== 0 ? mainWindow.webContents.send('movieDetails', trendingDetails) : null) 
  // (Object.keys(topRatedDetails).length !== 0 ? mainWindow.webContents.send('movieDetails', topRatedDetails) : null)  
  // (Object.keys(nowPlayingDetails).length !== 0 ? mainWindow.webContents.send('movieDetails', nowPlayingDetails) : null)  
  // (Object.keys(upComingDetails).length !== 0 ? mainWindow.webContents.send('movieDetails', upComingDetails) : null)    

})

ipcMain.on('getData', async(e, data) => {
  let array1
  let array2
  const moviesArr = await movies.findAll({
    attributes : ['name','movieId']
  })
  // const trendingArr = await trending.findAll({
  //   attributes : ['name','movieId']
  // })
  // const topRatedArr = await topRated.findAll({
  //   attributes : ['name','movieId']
  // })
  // const nowPlayingArr = await nowPlaying.findAll({
  //   attributes : ['name','movieId']
  // })
  // const upComingArr = await upComing.findAll({
  //   attributes : ['name','movieId']
  // })
  // array1 = trendingArr.concat(topRatedArr)
  // array2 = nowPlayingArr.concat(upComingArr)
  // let result = array1.concat(array2)
  mainWindow.webContents.send('searchData', moviesArr)
})