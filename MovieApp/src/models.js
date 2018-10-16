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
    releaseDate : Sequelize.DATE,
    rating : Sequelize.INTEGER,
    tagline : Sequelize.STRING,
    runtime : Sequelize.INTEGER,
    revenue : Sequelize.INTEGER,
    language : Sequelize.STRING
});
const trending = sequelize.define("trending", {
    name : Sequelize.STRING,
    movieId : Sequelize.INTEGER,
    imagePath : Sequelize.STRING,
    overview : Sequelize.TEXT,
    releaseDate : Sequelize.DATE,
    rating : Sequelize.INTEGER,
    tagline : Sequelize.STRING,
    runtime : Sequelize.INTEGER,
    revenue : Sequelize.INTEGER,
    language : Sequelize.STRING
});
const nowPlaying = sequelize.define("nowPlaying", {
    name : Sequelize.STRING,
    movieId : Sequelize.INTEGER,
    imagePath : Sequelize.STRING,
    overview : Sequelize.TEXT,
    releaseDate : Sequelize.DATE,
    rating : Sequelize.INTEGER,
    tagline : Sequelize.STRING,
    runtime : Sequelize.INTEGER,
    revenue : Sequelize.INTEGER,
    language : Sequelize.STRING
});
const upComing = sequelize.define("upComing", {
    name : Sequelize.STRING,
    movieId : Sequelize.INTEGER,
    imagePath : Sequelize.STRING,
    overview : Sequelize.TEXT,
    releaseDate : Sequelize.DATE,
    rating : Sequelize.INTEGER,
    tagline : Sequelize.STRING,
    runtime : Sequelize.INTEGER,
    revenue : Sequelize.INTEGER,
    language : Sequelize.STRING
});
module.exports = {
    sequelize: sequelize,
    topRated: topRated,
    nowPlaying: nowPlaying,
    trending: trending,
    upComing: upComing
}
