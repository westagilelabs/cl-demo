const Sequelize = require('sequelize');
const sqlite3 = require('sqlite3')
let config = require("./config.json")
const sequelize = new Sequelize("main", null, null,  {
  dialect: 'sqlite',
  storage: './database.db',
  operatorsAliases: false
});

const NewsList = sequelize.define("news_list", {
  author: Sequelize.TEXT,
  source: Sequelize.TEXT,
  title: Sequelize.TEXT,
  image_url: Sequelize.TEXT,
  source_url: Sequelize.TEXT,
  created_date: Sequelize.DATEONLY,
});
let db = new sqlite3.Database('/Users/walindia/Documents/cl-demo/News-client/app/database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});
const news_list = NewsList.build({author: '123', source: 'BBC', title: 'Testing'})
news_list.save().then(() => {
  console.log('news List created');
})
module.exports = {
  sequelize: sequelize,
  NewsList: NewsList
}
