/* eslint-disable */
const Sequelize = require('sequelize');
// const Config = require('../config');

const sequelize = new Sequelize('weatherForecast', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'weather.sqlite',
  operatorsAliases: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Weather = sequelize.define('weather', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  city: Sequelize.STRING,
  temperature: Sequelize.INTEGER,
  temp_min: Sequelize.INTEGER,
  temp_max: Sequelize.INTEGER,
  country: Sequelize.STRING,
  description: Sequelize.STRING,
  windSpeed: Sequelize.FLOAT,
  coordLat: Sequelize.FLOAT,
  coordLon: Sequelize.FLOAT,
  clouds: Sequelize.INTEGER,
  pressure: Sequelize.INTEGER,
  humidity: Sequelize.INTEGER,
  sunrise: Sequelize.STRING,
  sunset: Sequelize.STRING,
  foreCast: Sequelize.TEXT
});

export { sequelize, Weather };
