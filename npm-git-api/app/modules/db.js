const Sequelize = require('sequelize');
let db; 


function initializeDB(){
    if(db){
        return db;
    }else{
        console.log('current workign directory');
        console.log(process.cwd()+'/npm-git-api.sqlite');
        db = new Sequelize('npm-git-api','','',{
            host:'localhost',
            dialect:'sqlite',
            storage: process.cwd()+'/npm-git-api.sqlite'+''
        });
        
        return db;
    }
}

module.exports = initializeDB();