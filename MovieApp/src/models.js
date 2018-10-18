const Sequelize = require('sequelize');
const Config = require("./dbconfig");
const sequelize = new Sequelize(Config.database, Config.username, Config.password, {
    dialect: 'sqlite',
    storage: Config.storageFile,
    operatorsAliases: false
});

const movies = sequelize.define('movies', {
    category : Sequelize.STRING,
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
})


module.exports = {
    sequelize: sequelize,
    movies: movies
}
