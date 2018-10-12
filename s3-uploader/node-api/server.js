const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
require('dotenv').config();

// var {mongoose} = require('./mongoose');
// var {Upload} = require('./models/upload');
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
              // let upload = new Upload({
              //   s3_url: '',
              //   local_url: local_url,
              //   file_name: newFileName,
              //   file_size: files.file.size,
              //   file_type: files.file.type,
              //   action_type: 'NEW_FILE',
              //   connectivity: 0,
              // });

              // upload.save().then((dbSaveResp) => {
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

                           // Upload.findById(dbSaveResp._id, function (err, user) {
                           //    user.connectivity = 1
                           //    user.s3_url = uploadData.Location
                           //    user.save(function (err, dbUpdateResp) {
                           //      response.send(
                           //        {
                           //          'data': dbUpdateResp,
                           //          'success': true,
                           //          'msg': 'File is uploaded to s3 successfully'
                           //        }
                           //      );
                           //    });
                           // });
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
              // }, (error) => {
              //   response.status(400).send(error);
              // });
          });
        }
    });
});

// Update a file with same name
app.put('/upload/:id', (request, response) => {
  // Upload.findById(request.params.id, function (err, uploadObj) {
    // if (err) response.send({'success': false, 'msg': err});
    var form = new formidable.IncomingForm();
    form.parse(request, function(err, fields, files) {
        if (err) next(err);
        // let uploadObj = {};

        if(!Object.keys(files).length) {
          response.status(422).send({'success': false, 'err': 'Please select a file to upload.'});
        }
        else {
          form.uploadDir = localFileDir;
          let newFileName = fields.file_name;
          fs.rename(files.file.path, form.uploadDir + newFileName , function(err) {
              if (err) next(err);

              let local_url = 'http://' + request.headers.host + '/download/' + newFileName;
              // uploadObj.local_url = local_url;
              // uploadObj.file_name = newFileName;
              // uploadObj.file_size = files.file.size;
              // uploadObj.file_type = files.file.type;
              // uploadObj.action_type = 'UPDATE_FILE';
              // uploadObj.connectivity = 0;
              // uploadObj.uploaded_on = Date.now();

              // uploadObj.save().then((dbSaveResp) => {
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
                                'msg': 'File is updated & uploaded to s3 successfully'
                              }
                            );

                           // Upload.findById(dbSaveResp._id, function (err, user) {
                           //    user.connectivity = 1
                           //    user.s3_url = uploadData.Location
                           //    user.save(function (err, dbUpdateResp) {
                           //      response.send(
                           //        {
                           //          'data': dbUpdateResp,
                           //          'success': true,
                           //          'msg': 'File is updated & uploaded to s3 successfully'
                           //        }
                           //      );
                           //    });
                           // });
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
              // }, (error) => {
              //   response.status(400).send(error);
              // });
          });
        }
    });
  // });
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
