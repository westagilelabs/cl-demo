const Sequelize = window.require('sequelize');
const Config = require("../config.json");
const sequelize = new Sequelize(Config.database, Config.username, Config.password, {
  dialect: 'sqlite',
  host: Config.host,
  operatorsAliases: false,
  storage: './S3Uploader_DB.sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


const S3UploaderModel = sequelize.define("s3_uploader", {
    _id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    s3_url: {
      type: Sequelize.TEXT
    },
    local_url: {
      type: Sequelize.TEXT
    },
    file_name: {
      type: Sequelize.TEXT
    },
    file_size: {
      type: Sequelize.TEXT
    },
    file_type: {
      type: Sequelize.TEXT
    },
    connectivity: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0
    },
    uploaded_on: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    action_type: {
      type: Sequelize.TEXT
    }
});


// Sync all defined models to the DB.
// sequelize.sync().then( () => {
//     S3UploaderModel.create({
//         s3_url: "Task 3",
//         local_url: "sfdsf"
//     }).then( item => {
//         console.log(item)
//     })
// });

export {
  sequelize,
  S3UploaderModel
}
