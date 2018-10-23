import { bindCallback } from 'rxjs/observable/bindCallback';


var shell = require('shelljs');
var packages = require('./readpackage');
var request = require('request');
var async = require('async');
var Stats = require('./Stats');

export function getPackageDetails(packageName,callback){
    let output;
    let ownerDetails ={};
    packageName = packageName.replace(/@/g, '');
    shell.exec('npm view --json '+packageName+'' ,{},(code,stdout,stderror) => {
        if(stderror){
            console.log('Error in fetching npm view');
            callback(stderror,null);
        }else{
            output = JSON.parse(stdout);
            output.repository.url = output.repository.url.replace('git://github.com','https://github.com');
            ownerDetails.ownerName = output.repository.url.split('https://github.com/')[1];
            
            ownerDetails.ownerName = ownerDetails.ownerName.split('.git')[0];
            ownerDetails.packageName = ownerDetails.ownerName.split('/')[1];
            ownerDetails.ownerName = ownerDetails.ownerName.split('/')[0];
            console.log('owner details:::::');
            console.log(ownerDetails);
            callback(null,ownerDetails);
        }
    });
}

export function getRepoStats(repo,callback){
  let ownerName = repo.ownerName.replace(/@/g,'');
  let packageName = repo.packageName.replace(/@/g,'');

  request({
    method:'GET',
    uri:'https://api.github.com/repos/'+repo.ownerName+'/'+repo.packageName,
    headers:{
        'User-Agent':'electron-test'
    }
  },function(error,response,body){
      if(error){
          callback(error,null);
      }else{
          callback(null,body);
      }
  });  
}

export function getStats(packageName,callback){
  async.waterfall([
      function(callback){
        getPackageDetails(packageName,callback);
      },function(data,callback){
        getRepoStats(data,callback);
      },
      function(data,callback){
          let stats = JSON.parse(data);
          Stats.findOrCreate({
              where:{name:packageName},
              defaults:{
                forks_count:stats.forks_count,
                subscribers_count:stats.subscribers_count,
                size:stats.size,
                watchers_count:stats.watchers_count,
                open_issues:stats.open_issues,
                name:packageName
              }
          }).spread((stat,created) => {
              if(!created){
                stat.forks_count = data.forks_count;
                stat.subscribers_count = data.subscribers_count;
                stat.size = data.size;
                stat.watchers_count = data.watchers_count;
                stat.open_issues = data.open_issues;
                stat.save();
              }
              callback(null,data);
          }).catch(err => {
              console.log('ERROR;;;;');
              console.log(err);
              callback(null,data);
          });
      }
  ],(err,result) => {
      if(err){
          console.log('errro:::::', err);
        callback(err,null);
      }else{
        callback(null,result);
      }
  });
};

export function getOfflineStats(packageName,callback){
    console.log('Before goign to get Stats');
    Stats.findOne({
        where: {name:packageName},
        raw:true
    }
    ).then(stat => {
        console.log(stat);
        callback(null,JSON.stringify(stat));
    }).catch(err => {
        callback(err,null);
    });
}