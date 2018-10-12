const Sequelize = require('sequelize');
const Config = require("./dbconfig");
const sequelize = new Sequelize(Config.database, Config.username, Config.password, {
    dialect: 'sqlite',
    storage: Config.storageFile,
    operatorsAliases: false
});

const topRated = sequelize.define("topRated", {
    name : Sequelize.STRING,
    movieId : Sequelize.INTEGER,
    imagePath : Sequelize.STRING,
    overview : Sequelize.TEXT,
    releaseDate : Sequelize.DATEONLY,
    rating : Sequelize.INTEGER
});
const trending = sequelize.define("trending", {
    name : Sequelize.STRING,
    movieId : Sequelize.INTEGER,
    imagePath : Sequelize.STRING,
    overview : Sequelize.TEXT,
    releaseDate : Sequelize.DATEONLY,
    rating : Sequelize.INTEGER
});
const nowPlaying = sequelize.define("nowPlaying", {
    name : Sequelize.STRING,
    movieId : Sequelize.INTEGER,
    imagePath : Sequelize.STRING,
    overview : Sequelize.TEXT,
    releaseDate : Sequelize.DATEONLY,
    rating : Sequelize.INTEGER
});
const upComing = sequelize.define("upComing", {
    name : Sequelize.STRING,
    movieId : Sequelize.INTEGER,
    imagePath : Sequelize.STRING,
    overview : Sequelize.TEXT,
    releaseDate : Sequelize.DATEONLY,
    rating : Sequelize.INTEGER
});
module.exports = {
    sequelize: sequelize,
    topRated: topRated,
    nowPlaying: nowPlaying,
    trending: trending,
    upComing: upComing
}
