const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
require('dotenv').config();

var formidable = require("formidable");
const fs = require('fs');
var http = require("http");
var internetAvailable = require("internet-available");
const AWS = require('aws-sdk');
var shortid = require('shortid');
var requestVar = require('request');
const sqlite3 = require('sqlite3').verbose();
var moment = require('moment');
var mime = require('mime');
const uuidV4 = require('uuid/v4');

let sqlite_db = new sqlite3.Database('../S3Uploader_DB.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the sqlite database.');
});


function getLocalTime(dt){
  let dateFormat = 'YYYY-MM-DD HH:mm:ss';
  let testDateUtc = moment.utc(dt);
  let localDate = testDateUtc.local();
  return localDate.format(dateFormat);
}


const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY
});
const s3_bucket = process.env.S3_BUCKET;
const localFileDir = './uploads/';

var app = express();
app.use(bodyParser.json(), function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method)
    res.sendStatus(200);
  else
    next();
});

// Upload a new file to s3
app.post('/upload', (request, response) => {
    var form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files) {
        if (err) next(err);
        if(!Object.keys(files).length) {
          response.status(422).send({'success': false, 'err': 'Please select a file to upload.'});
        }
        else {
          form.uploadDir = localFileDir;
          let newFileName = shortid.generate() + '.' + files.file.name.split('.').pop()
          fs.rename(files.file.path, form.uploadDir + newFileName , function(err) {
              if (err) next(err);

              let local_url = 'http://' + request.headers.host + '/download/LOCAL/' + newFileName;
                internetAvailable().then(function(){
                    fs.readFile(localFileDir + newFileName, (err, data) => {
                       if (err) throw err;
                       const params = {
                           Bucket: s3_bucket,
                           Key: newFileName,
                           Body: data,
                           ACL: 'public-read',
                           ContentType: files.file.type
                       };
                       s3.upload(params, function(s3Err, uploadData) {
                           if (s3Err) throw s3Err
                           uploadData.local_url = local_url

                           response.send(
                              {
                                'data': uploadData,
                                'success': true,
                                'msg': 'File is uploaded to s3 successfully'
                              }
                            );
                       });
                    });
                }).catch(function(){
                    let localUploadData = {'local_url': local_url, 'Location': 'NA', 'Key': newFileName}
                    response.send(
                      {
                        'data': localUploadData,
                        'success': true,
                        'msg': 'File is uploaded to local disk successfully',
                        'connectivityProb': 'It seems internet connection is not available'
                      }
                    );
                });
          });
        }
    });
});

// Update a file with same name
app.put('/upload/:id', (request, response) => {
    var form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files) {
        if (err) next(err);
        if(!Object.keys(files).length) {
          response.status(422).send({'success': false, 'err': 'Please select a file to upload.'});
        }
        else {
          // deleting existing file from local disk
          fs.unlink(localFileDir + '/' + fields.old_file,function(err){});

          form.uploadDir = localFileDir;
          let newFileName = fields.file_name;
          fs.rename(files.file.path, form.uploadDir + newFileName , function(err) {
              if (err) next(err);

              let local_url = 'http://' + request.headers.host + '/download/LOCAL/' + newFileName;
                internetAvailable().then(function(){
                    fs.readFile(localFileDir + newFileName, (err, data) => {
                       if (err) throw err;

                       // deleting existing file from s3
                       s3.deleteObject({Bucket: s3_bucket,Key: fields.old_file}, function (err, data) {
                         console.log('Deleting existing file');
                       });


                       const params = {
                           Bucket: s3_bucket,
                           Key: newFileName,
                           Body: data,
                           ACL: 'public-read',
                           ContentType: files.file.type
                       };
                       s3.upload(params, function(s3Err, uploadData) {
                           if (s3Err) throw s3Err
                           uploadData.local_url = local_url

                           response.send(
                              {
                                'data': uploadData,
                                'success': true,
                                'msg': 'File is updated & uploaded to s3 successfully'
                              }
                            );
                       });
                    });
                }).catch(function(){
                    let localUploadData = {'local_url': local_url, 'Location': fields.s3_url, 'Key': newFileName}
                    response.send(
                      {
                        'data': localUploadData,
                        'success': true,
                        'msg': 'File is updated & uploaded to local disk successfully',
                        'connectivityProb': 'It seems internet connection is not available'
                      }
                    );
                });
          });
        }
    });
});

// Get all files from s3
app.get('/upload', (request, response) => {
  let params = {
    Bucket: s3_bucket
  };
  s3.listObjects(params, function(err, data) {
   if (err) console.log(err, err.stack);
   else {
     response.send(data);
   }
 });
});

// Get list of all file from DB
app.get('/list-files', (request, response) => {
  Upload.find({is_deleted: 0}).sort('-uploaded_on').then((files) => {
    response.send({files});
  }, (error) => {
    response.status(400).send(error);
  })
});


// Download a file
app.get('/download/:is_s3_url/:file_name', (request, response) => {
  let file_name = request.params.file_name;
  let file_path;
  if(request.params.is_s3_url == 'S3') {
    internetAvailable().then(function(){
      file_path = "https://"+s3_bucket+".s3.amazonaws.com/"+file_name;
      requestVar(file_path).pipe(response);
    }).catch(function(){
      if (fs.existsSync("./uploads/"+file_name)) {
        file_path = "./uploads/"+file_name;
        response.download(file_path);
      } else {
        response.send({'err': 'This file was not found in local disk'});
      }
    });
  } else {
    if (fs.existsSync("./uploads/"+file_name)) {
      file_path = "./uploads/"+file_name;
      response.download(file_path);
    } else {
      response.send({'err': 'This file was not found in local disk'});
    }
  }
});

// Delete File
app.delete('/upload/:id', (request, response) => {
  let id = request.params.id;
  let file_name = request.body.file_name;
  let notFoundOnLocalDisk;
  fs.unlink(localFileDir + '/' + file_name,function(err){
    if(err) {
      if(err.errno == -2) {
        notFoundOnLocalDisk = 'This file was not found in local disk';
      }
    }
    let params = {
        Bucket: s3_bucket,
        Key: file_name
    };
    internetAvailable().then(function(){
      s3.deleteObject(params, function (err, data) {
          if (data) {
              response.send({'success': true, 'msg': 'File deleted successfully from S3', 'connectivity': true, 'notFoundOnLocalDisk': notFoundOnLocalDisk});
          }
          else {
              response.status(400).send({'success': false, 'msg': err});
          }
      });
    }).catch(function(){
        response.send(
            {'success': true, 'msg': 'File deleted successfully from local disk', 'connectivityProb': 'It seems internet connection is not available', 'connectivity': false, 'notFoundOnLocalDisk': notFoundOnLocalDisk}
        );
    });
  });
});

// Delete All Files
app.delete('/delete-all', (request, response) => {
  let file_names = request.body.file_names;
  let deleteObj = [];
  file_names.forEach(function (item, i) {
    let file_name = item.file_name
    fs.unlink(localFileDir + '/' + file_name,function(err){
      if(err) return console.log(err);
      deleteObj.push({Key : file_name});
    });
  });

  var params = {
    Bucket: s3_bucket,
    Delete: {
      Objects: deleteObj
    }
  };

  internetAvailable().then(function(){
    s3.deleteObjects(params, function (err, data) {
        response.send({'success': true, 'msg': 'All files are deleted successfully from S3', 'connectivity': true});
    });
  }).catch(function(){
    response.send(
        {'success': true, 'msg': 'All files are deleted successfully from local disk', 'connectivityProb': 'It seems internet connection is not available', 'connectivity': false}
    );
  });
});

app.post('/dump', (request, response) => {
  fs.readdir('./testImages', (err, files) => {
    let imageArr = [];
    files.forEach(function (file, i) {
      if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(file)) {
        imageArr.push(file);
        let fn = './testImages/'+file;
        let dn = './uploads/'+file;

        fs.copyFile(fn,dn, (err) => {
          fs.readFile(dn, (err, data) => {
            const params = {
                Bucket: s3_bucket,
                Key: file,
                Body: data,
                ACL: 'public-read',
                ContentType: 'image/jpeg'
            };
            s3.upload(params, function(s3Err, uploadData) {
              if(files.length == (i+1)) {
                response.send(
                    {'success': true, 'msg': 'all files are uploaded', 'length': (i+1), 'files': imageArr}
                );
              }
            });
          });
        });
      }
    });
  })
});

function downloadFilestoLocalDisk(key, host, type) {
 let file_name = key.Key;
 let params = {
     Bucket: s3_bucket,
     Key: file_name
 }

 let file = require('fs').createWriteStream(localFileDir+file_name);
 s3.getObject(params).createReadStream().pipe(file);

 let s3_url = 'https://'+s3_bucket+'.s3.amazonaws.com/'+file_name;
 let local_url = 'http://' + host + '/download/LOCAL/' + file_name;
 let file_size = key.Size;
 let uploaded_on = moment.utc(key.LastModified).format('YYYY-MM-DD HH:mm:ss')
 let file_type = mime.getType(file_name);
 let _id = uuidV4();

 if(type == 'new') {
   sqlite_db.run("INSERT into s3_uploaders(_id, s3_url, local_url, file_name, file_size, file_type, uploaded_on, action_type, createdAt, updatedAt, connectivity) VALUES ('"+_id+"', '"+s3_url+"', '"+local_url+"', '"+file_name+"', '"+file_size+"', '"+file_type+"', '"+uploaded_on+"', 'NEW_FILE', '"+uploaded_on+"', '"+uploaded_on+"', 1)");
 } else {
   sqlite_db.run("UPDATE s3_uploaders SET file_size = '"+file_size+"', file_type = '"+file_type+"', uploaded_on = '"+uploaded_on+"', updatedAt = '"+uploaded_on+"', connectivity = 1 WHERE file_name = '"+file_name+"'");
 }
}

function offlineSynchronization() {
  return new Promise(function(resolve, reject) {
      sqlite_db.all('SELECT * from s3_uploaders where connectivity = 0 order by uploaded_on DESC', (err, result) => {
        if (err) {
          reject(err);
        } else {
          if(result.length) {
            let k = 0;
            result.forEach( (item) => {
              if(item.action_type == 'NEW_FILE' || item.action_type == 'UPDATE_FILE') {
                fs.readFile(localFileDir+item.file_name, (err, data) => {
                   if (err) throw err;
                   const params = {
                       Bucket: s3_bucket,
                       Key: item.file_name,
                       Body: data,
                       ACL: 'public-read',
                       ContentType: item.file_type
                   };
                   s3.upload(params, function(s3Err, uploadData) {
                       if (s3Err) throw s3Err
                       console.log('Offline sync - File uploaded successfully');
                       let uploaded_on = moment.utc().format('YYYY-MM-DD HH:mm:ss')
                       sqlite_db.run("UPDATE s3_uploaders SET uploaded_on = '"+uploaded_on+"', updatedAt = '"+uploaded_on+"', connectivity = 1, s3_url ='"+uploadData.Location+"' WHERE file_name = '"+item.file_name+"'");
                   });
                });
              } else if(item.action_type == 'DELETE_FILE') {
                let params = {
                    Bucket: s3_bucket,
                    Key: item.file_name
                };
                s3.deleteObject(params, function (err, data) {
                  if (err) throw err
                  console.log('Offline sync - File deleted successfully');
                  sqlite_db.run("DELETE FROM s3_uploaders WHERE file_name = '"+item.file_name+"'");
                });
              }
              k++;
              if(k == result.length) {
                resolve({'success': true, 'msg': 'Sync completed', 'code': 201});
              }
            });
          } else {
            resolve({'success': true, 'msg': 'No files to update s3', 'code': 200});
          }
        }
      });
  });
}

//Sync
app.get('/sync', (request, response) => {
  internetAvailable().then(function(){
    offlineSynchronization().then(function(result) {
      setTimeout( () => {
        let params = {
          Bucket: s3_bucket
        };

        let sql = `SELECT * FROM s3_uploaders where is_deleted = 0 ORDER BY uploaded_on desc`;
        sqlite_db.all(sql, [], (err, filesObjFromLocal) => {
          if (err) {
            throw err;
          }

          s3.listObjects(params, function(err, data) {
             if (err) console.log(err, err.stack);
             else {
               let filesObjFromS3 = data.Contents;
               let k = 1;
               if(filesObjFromS3.length == 0) {
                 response.send(
                     {'success': true, 'msg': 'S3 Bucket is empty'}
                 );
               }
               filesObjFromS3.forEach( (item, index) => {
                 let foundValue = filesObjFromLocal.filter(obj=>obj.file_name===item.Key);

                 if(foundValue.length > 0) {
                   let s3_date = moment(getLocalTime(item.LastModified));
                   let d1 = foundValue[0].uploaded_on.split('.')
                   let local_date = moment(getLocalTime(d1[0]));
                   let duration = moment.duration(s3_date.diff(local_date));
                   let diffInSeconds = duration.asSeconds();
                   if(diffInSeconds > 1) {
                     downloadFilestoLocalDisk(item, request.headers.host, 'update');
                     if(k === filesObjFromS3.length) {
                       response.send(
                           {'success': true, 'msg': 'Sync Completed', 'code': 100}
                       );
                     }
                     k++;
                   } else {
                     if(k === filesObjFromS3.length) {
                       response.send(
                           {'success': true, 'msg': 'Sync Completed', 'code': 102}
                       );

                       // if(result.code == 201) {
                       //   response.send(
                       //       {'success': true, 'msg': result.msg, 'code': 102}
                       //   );
                       // } else {
                       //   response.send(
                       //       {'success': true, 'msg': 'Sync is up-to-date', 'code': 99}
                       //   );
                       // }
                     }
                     k++;
                   }
                 } else {
                   downloadFilestoLocalDisk(item, request.headers.host, 'new');
                   if(k === filesObjFromS3.length) {
                     response.send(
                         {'success': true, 'msg': 'Sync Completed', 'code': 101}
                     );
                   }
                   k++;
                 }
               });
             }
          });
        });
      }, 5000);
    });
  }).catch(function(){
      response.send(
        {
          'success': false,
          'msg': 'It seems internet connection is not available'
        }
      );
  });
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
