// @flow
import React, { Component } from 'react';
import { render } from "react-dom";
import routes from '../constants/routes';
import styles from './Upload.global.css';
import { Button, Label, Link } from 'react-desktop/macOs';
import axios from 'axios';
import {ToastContainer, ToastStore} from 'react-toasts';
import ReactTable from "react-table";
import moment from 'moment';
import S3UploaderModelOperations from './S3UploaderModelOperations';

export class SpinnerComponent extends React.Component{
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div>
          <img src="spinner.gif"/>
      </div>
    );
  }
}

export default class Upload extends React.Component{
  constructor(props) {
    super(props);
    this.state ={
      file: null,
      updatefile: null,
      update_id: null,
      showSpinner: false,
      rowIndex: null,
      listOfFiles: []
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
    this.getFilesData = this.getFilesData.bind(this)
    this.downloadFile = this.downloadFile.bind(this)
    this.selectUpdateFile = this.selectUpdateFile.bind(this)
    this.onFileUpdate = this.onFileUpdate.bind(this)
    this.getLocalTime = this.getLocalTime.bind(this)
    this.deleteFile = this.deleteFile.bind(this)
    this.dumpData = this.dumpData.bind(this)
    this.sync = this.sync.bind(this)

    this.base_url = 'http://localhost:3000/'
  }

  sync() {

  }

  dumpData() {
    this.setState({showSpinner: true});
    axios.post('http://localhost:3000/dump', {})
    .then( (response) => {
        response.data.files.forEach( (file) => {
          let model = {
            s3_url: 'https://c3-demo.s3.amazonaws.com/'+file,
            local_url: 'http://localhost:3000/download/'+file,
            file_name: file,
            file_size: 12325,
            file_type: 'image/jpeg',
            action_type: 'NEW_FILE',
            connectivity: 1
          }

          S3UploaderModelOperations.newFile(model).then( (dbResp) => {});
        });
    })
    .then( () => {
      setTimeout( () => {
         this.getFilesData();
         this.setState({showSpinner: false});
         ToastStore.success('50 Test Images are uploaded to S3');
       }, 100);
    });
  }

  selectUpdateFile(id , rowIndex) {
    this.refs.selectUpdateFile.click();
    this.state.update_id = id;
    this.setState({rowIndex: rowIndex});
  }

  downloadFile(file, s3_url) {
    let is_s3_url = s3_url!='NA' ? 'S3' : 'LOCAL'
    if(is_s3_url == 'S3') {
      ToastStore.info('Download is in progress...');
    }
    axios({
        url: 'http://localhost:3000/download/'+is_s3_url+'/'+file,
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        if(response.data.size <= 47) {
          ToastStore.error('This file was not found in local disk');
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file);
          document.body.appendChild(link);
          link.click();
        }
      });
  }

  componentDidMount() {
    this.getFilesData()
  }

  getLocalTime(dt){
    let dateFormat = 'YYYY-MM-DD HH:mm:ss';
    let testDateUtc = moment.utc(dt);
    let localDate = testDateUtc.local();
    return localDate.format(dateFormat);
  }

  getFilesData(){
    S3UploaderModelOperations.getAllFiles().then( (files) => {
      files.forEach( (item) => {
        item.uploaded_on = this.getLocalTime(item.uploaded_on)
        item.file_size = this.getFileSize(item.file_size)
      });
      this.setState({listOfFiles: files});
    });
  }

  getFileSize(fsize) {
    return Math.round(fsize/1000) + ' KB';
  }

  deleteFile(id, rowIndex) {
    if(confirm(id=="all" ? "Are you sure want to delete all files ?" : "Are you sure want to delete this file ?")) {
      this.setState({showSpinner: true});
      let delete_id = id;
      if(delete_id == 'all') {
        S3UploaderModelOperations.getAllFiles().then( (files) => {
          let fileNamesObj = [];
          files.forEach(item => {
            fileNamesObj.push({file_name: item.file_name})
          });

          const deleteUrl = "http://localhost:3000/delete-all";
          const httpReqHeaders = {
            'Content-Type': 'application/json'
          };
          const axiosConfigObject = {headers: httpReqHeaders, data: {file_names: fileNamesObj}};
          axios.delete(deleteUrl, axiosConfigObject).then((response)=>{
            const deleteUrl = "http://localhost:3000/upload/idnotneed";
            const httpReqHeaders = {
              'Content-Type': 'application/json'
            };

            if(response.data.connectivity) {
              S3UploaderModelOperations.deleteAllFiles().then( (dbResp) => {
                if(dbResp) {
                  this.state.listOfFiles.length = 0;
                  this.setState({listOfFiles: this.state.listOfFiles})
                  ToastStore.success(response.data.msg);
                  this.setState({showSpinner: false});
                }
              });
            } else {
              ToastStore.error(response.data.connectivityProb);
              S3UploaderModelOperations.softDeleteAllFiles().then( (dbResp) => {
                if(dbResp) {
                  this.state.listOfFiles.length = 0;
                  this.setState({listOfFiles: this.state.listOfFiles})
                  ToastStore.success(response.data.msg);
                  this.setState({showSpinner: false});
                }
              });
            }
          })
          .catch((err) => {
            ToastStore.error(err.response.data.msg);
            this.setState({showSpinner: false});
          });
        });
      } else {
        S3UploaderModelOperations.getFileInfoById(delete_id).then( (dbResp) => {
          const deleteUrl = "http://localhost:3000/upload/idnotneed";
          const httpReqHeaders = {
            'Content-Type': 'application/json'
          };
          const axiosConfigObject = {headers: httpReqHeaders, data: {file_name: dbResp.dataValues.file_name}};
          axios.delete(deleteUrl, axiosConfigObject).then((response)=>{
            if(response.data.connectivity) {
              S3UploaderModelOperations.deleteFile(delete_id).then( (deleteResp) => {
                this.state.listOfFiles.splice(rowIndex, 1);
                this.setState({listOfFiles: this.state.listOfFiles})
                ToastStore.success(response.data.msg);
                this.setState({showSpinner: false});
              });
            } else {
              ToastStore.error(response.data.connectivityProb);
              let deleteObj = {}
              deleteObj._id = delete_id;
              deleteObj.action_type = 'DELETE_FILE';
              deleteObj.connectivity = 0;
              deleteObj.is_deleted = 1;
              S3UploaderModelOperations.updateFile(deleteObj).then( (deleteResp) => {
                this.state.listOfFiles.splice(rowIndex, 1);
                this.setState({listOfFiles: this.state.listOfFiles})
                ToastStore.success(response.data.msg);
                this.setState({showSpinner: false});
              });
            }

            if(typeof response.data.notFoundOnLocalDisk != 'undefined') {
              ToastStore.error(response.data.notFoundOnLocalDisk);
            }
          })
          .catch((err) => {
            ToastStore.error(err.response.data.msg);
            this.setState({showSpinner: false});
          });
        });
      }
    }
  }

  onFormSubmit(e){
    e.preventDefault();
    if(this.state.file != null)
    this.setState({showSpinner: true});
    this.fileUpload(this.state.file).then((response)=>{
      if(typeof response.data.success != 'undefined' && response.data.success) {
        let res = response.data.data;
        let model = {
          s3_url: res.Location,
          local_url: res.local_url,
          file_name: res.Key,
          file_size: this.state.file.size,
          file_type: this.state.file.type,
          action_type: 'NEW_FILE',
          connectivity: 1
        }
        if(typeof response.data.connectivityProb != 'undefined') {
          model.connectivity = 0;
          ToastStore.error(response.data.connectivityProb);
        }

        S3UploaderModelOperations.newFile(model).then( (dbResp) => {
            if(dbResp) {
              let modelObj = dbResp.dataValues;
              modelObj.uploaded_on = this.getLocalTime(dbResp.dataValues.uploaded_on)
              modelObj.file_size = this.getFileSize(modelObj.file_size)
              this.state.listOfFiles.unshift(modelObj);
              this.setState({listOfFiles: this.state.listOfFiles});

              ToastStore.success(response.data.msg)
              this.refs.uploadFile.value = '';
              this.state.file = '';
              this.setState({showSpinner: false});
            }
        });
      } else {
        ToastStore.error(response.data.err);
        this.setState({showSpinner: false});
      }
    })
    .catch((err) => {
      ToastStore.error(err.response.data.err);
      this.setState({showSpinner: false});
    });
  }

  onFileUpdate(e) {
    this.setState({updatefile: e.target.files[0]}, () => {
        let update_id = this.state.update_id;
        S3UploaderModelOperations.getFileInfoById(update_id).then( (dbResp) => {
          this.setState({showSpinner: true});
          const url = 'http://localhost:3000/upload/idnotneeded';
          const updateFormData = new FormData();
          updateFormData.append('file', this.state.updatefile)
          updateFormData.append('file_name', dbResp.dataValues.file_name)
          updateFormData.append('s3_url', dbResp.dataValues.s3_url)
          const config = {
              headers: {
                  'content-type': 'multipart/form-data'
              }
          }

          axios.put(url, updateFormData, config).then((response)=>{
            if(typeof response.data.success != 'undefined' && response.data.success) {
              let res = response.data.data;
              let model = {
                _id: this.state.update_id,
                s3_url: res.Location,
                local_url: res.local_url,
                file_name: res.Key,
                file_size: this.state.updatefile.size,
                file_type: this.state.updatefile.type,
                action_type: 'UPDATE_FILE',
                connectivity: 1,
                uploaded_on: new Date()
              }
              if(typeof response.data.connectivityProb != 'undefined') {
                model.connectivity = 0;
                ToastStore.error(response.data.connectivityProb);
              }

              S3UploaderModelOperations.updateFile(model).then( (dbResp) => {
                let modelObj = dbResp.dataValues;
                modelObj.uploaded_on = this.getLocalTime(dbResp.dataValues.uploaded_on)
                modelObj.file_size = this.getFileSize(modelObj.file_size)
                this.state.listOfFiles[this.state.rowIndex] = modelObj
                this.setState({listOfFiles: this.state.listOfFiles});

                ToastStore.success(response.data.msg)
                this.refs.uploadFile.value = '';
                this.state.file = '';
                this.state.update_id = null;
                this.state.rowIndex = null;
                this.state.updatefile = null;
                this.setState({showSpinner: false});
              });

            } else {
              ToastStore.error(response.data.err);
              this.setState({showSpinner: false});
            }
          })
          .catch((err) => {
            ToastStore.error(err.response.data.err);
            this.setState({showSpinner: false});
          });
        });
    });
  }

  onChange(e) {
    this.setState({file:e.target.files[0]})
  }

  fileUpload(file){
    const url = 'http://localhost:3000/upload';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return axios.post(url, formData, config);
  }

  render() {
    return (
      <div className={styles.container} data-tid="container">
          <form onSubmit={this.onFormSubmit}>
            <h1>S3 Uploader</h1>
            <input type="file" onChange={this.onChange} ref="uploadFile" accept='application/msword, application/pdf, image/*'/>
            <input type="file" onChange={this.onFileUpdate} ref="selectUpdateFile" style={{display: "none"}} accept='application/msword, application/pdf, image/*'/>
            <Button color="blue" type="submit">
              Upload to S3
            </Button>
            <br/><br/><br/>
            <Button color="blue" type="button" onClick={() => this.deleteFile('all', null)}>
              Delete All Files
            </Button>
            <br/><br/>
            <Button color="blue" type="button" onClick={() => this.dumpData()}>
              Upload Dummy Data
            </Button>
            <br/><br/>
            <Button color="blue" type="button" onClick={() => this.sync()}>
              SYNC
            </Button>

            <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_RIGHT} lightBackground/>
            { this.state.showSpinner ? <SpinnerComponent/> : null }
          </form>
          <br/>
          <ReactTable
          data={this.state.listOfFiles}
          pageSizeOptions= {[5, 10, 20]}
          defaultPageSize= {10}
          columns={[
            {
              columns: [
                {
                  Header: "File Name",
                  accessor: "file_name",
                  minWidth: 200
                },
                {
                  Header: "File Type",
                  accessor: "file_type",
                  minWidth: 30,
                  sortable: false
                },
                {
                  Header: "File Size",
                  accessor: "file_size",
                  minWidth: 20
                },
                {
                  Header: "Uploaded On",
                  accessor: "uploaded_on",
                  minWidth: 50
                },
                {
                  Header: "Action",
                  Cell: row => (
                    <div>
                      <span onClick={() => this.selectUpdateFile(row.original._id, row.index)}><i className="fas fa-upload hover"></i></span>
                      <span> / </span>
                      <span onClick={() => this.deleteFile(row.original._id, row.index)}><i className="fas fa-times hover"></i></span>
                      <span> / </span>
                      <span onClick={() => this.downloadFile(row.original.file_name, row.original.s3_url)}><i className="fas fa-file-download hover"></i></span>
                    </div>
                  ),
                  minWidth: 20
                }
              ]
            }
          ]}
          className="-striped -highlight"
          SubComponent={row => {
            return (
              <div>
                <Label>
                  S3 url :
                  <Link color="white">
                    {row.original.s3_url}
                  </Link>
                </Label>
                <Label>
                  Local url :
                  <Link color="white">
                    {row.original.local_url}
                  </Link>
                </Label>
              </div>
            )
          }}
        />
      </div>
    );
  }
}
