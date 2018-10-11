const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
require('dotenv').config();

var {mongoose} = require('./mongoose');
var {Upload} = require('./models/upload');
var formidable = require("formidable");
var fs = require("fs");
var http = require("http");
// var https = require('https');
var internetAvailable = require("internet-available");
const AWS = require('aws-sdk');
var shortid = require('shortid');
var requestVar = require('request');

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

              let local_url = 'http://' + request.headers.host + '/download/' + newFileName;
              let upload = new Upload({
                s3_url: '',
                local_url: local_url,
                file_name: newFileName,
                file_size: files.file.size,
                file_type: files.file.type,
                action_type: 'NEW_FILE',
                connectivity: 0,
              });

              upload.save().then((dbSaveResp) => {
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

                           Upload.findById(dbSaveResp._id, function (err, user) {
                              user.connectivity = 1
                              user.s3_url = uploadData.Location
                              user.save(function (err, dbUpdateResp) {
                                response.send(
                                  {
                                    'data': dbUpdateResp,
                                    'success': true,
                                    'msg': 'File is uploaded to s3 successfully'
                                  }
                                );
                              });
                           });
                       });
                    });
                }).catch(function(){
                    response.send(
                      {
                        'data': dbSaveResp,
                        'success': true,
                        'msg': 'File is uploaded to local disk successfully',
                        'connectivityProb': 'It seems internet connection is not available'
                      }
                    );
                });
              }, (error) => {
                response.status(400).send(error);
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
  let file_path
  if(request.params.is_s3_url == 'S3') {
    file_path = "https://c3-demo.s3.amazonaws.com/"+file_name;
    requestVar(file_path).pipe(response);
  } else {
    file_path = "./uploads/"+file_name;
    response.download(file_path);
  }
});


// Update a file with same name
app.put('/upload/:id', (request, response) => {
  Upload.findById(request.params.id, function (err, uploadObj) {
    if (err) response.send({'success': false, 'msg': err});
    var form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files) {
        if (err) next(err);
        if(!Object.keys(files).length) {
          response.status(422).send({'success': false, 'err': 'Please select a file to upload.'});
        }
        else {
          form.uploadDir = localFileDir;
          let newFileName = uploadObj.file_name;
          fs.rename(files.file.path, form.uploadDir + newFileName , function(err) {
              if (err) next(err);

              let local_url = 'http://' + request.headers.host + '/download/' + newFileName;
              uploadObj.local_url = local_url;
              uploadObj.file_name = newFileName;
              uploadObj.file_size = files.file.size;
              uploadObj.file_type = files.file.type;
              uploadObj.action_type = 'UPDATE_FILE';
              uploadObj.connectivity = 0;
              uploadObj.uploaded_on = Date.now();

              uploadObj.save().then((dbSaveResp) => {
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

                           Upload.findById(dbSaveResp._id, function (err, user) {
                              user.connectivity = 1
                              user.s3_url = uploadData.Location
                              user.save(function (err, dbUpdateResp) {
                                response.send(
                                  {
                                    'data': dbUpdateResp,
                                    'success': true,
                                    'msg': 'File is updated & uploaded to s3 successfully'
                                  }
                                );
                              });
                           });
                       });
                    });
                }).catch(function(){
                    response.send(
                      {
                        'data': dbSaveResp,
                        'success': true,
                        'msg': 'File is updated & uploaded to local disk successfully',
                        'connectivityProb': 'It seems internet connection is not available'
                      }
                    );
                });
              }, (error) => {
                response.status(400).send(error);
              });
          });
        }
    });
  });
});

// Delete File
app.delete('/upload/:id', (request, response) => {
  let id = request.params.id;
  if(mongoose.Types.ObjectId.isValid(id)) {

    Upload.findById(id, function (err, uploadObj) {
      fs.unlink(localFileDir + '/' + uploadObj.file_name,function(err){
        if(err) return console.log(err);

        uploadObj.action_type = 'DELETE_FILE';
        uploadObj.connectivity = 0;
        uploadObj.is_deleted = 1;

        uploadObj.save().then((dbSaveResp) => {
          let params = {
              Bucket: s3_bucket,
              Key: uploadObj.file_name
          };

          internetAvailable().then(function(){
            s3.deleteObject(params, function (err, data) {
                if (data) {
                    Upload.findByIdAndRemove(id, function(err, deletedResp) {
                      if (err)
                          response.send(err);
                        else {
                          if(deletedResp != null) {
                            response.send({'success': true, 'msg': 'File deleted successfully'});
                          } else {
                            response.send({'success': false, 'msg': 'File not found'});
                          }
                        }
                    });
                }
                else {
                    console.log("Check if you have sufficient permissions : "+err);
                }
            });
          }).catch(function(){
              response.send(
                  {'success': true, 'msg': 'File deleted successfully', 'connectivityProb': 'It seems internet connection is not available'}
              );
          });
        }, (error) => {
          response.status(400).send(error);
        });
      });
    });
  }
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});



// delete All files from s3
// let params = {
//   Bucket: s3_bucket
// };
// s3.listObjects(params, function(err, data) {
//  if (err) console.log(err, err.stack);
//  else {
//    for(let i=0;i<data.Contents.length;i++) {
//      s3.deleteObject({Bucket: s3_bucket, Key: data.Contents[i].Key}, function (err, data) {
//         console.log(data.Contents[i].Key + ' Deleted');
//      });
//    }
//  }
// });
