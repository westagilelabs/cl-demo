const Sequelize = require('sequelize');
const sequelize = require('./db');


const Stats = sequelize.define('stats',{ 
  forks_count: Sequelize.INTEGER,
  subscribers_count:Sequelize.INTEGER,
  size: Sequelize.INTEGER,
  watchers_count:Sequelize.INTEGER,
  open_issues:Sequelize.INTEGER,
  name:Sequelize.TEXT
  
});

module.exports =  Stats;