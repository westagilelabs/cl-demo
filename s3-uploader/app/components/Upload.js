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
import SpinnerComponent from './preloader/preloader'
import Modal from 'react-responsive-modal';

export default class Upload extends React.Component{
  constructor(props) {
    super(props);
    this.state ={
      file: null,
      updatefile: null,
      update_id: null,
      showSpinner: false,
      rowIndex: null,
      listOfFiles: [],
      fileName: null,
      open: false,
      file_info: {file_name:null, file_type:null, file_size:null, s3_url:null, local_url:null, connectivity:null}
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
    this.getSrc = this.getSrc.bind(this)

    this.base_url = 'http://localhost:3000/'
    this.toast_timeout = 3000;
  }

  sync() {
    this.setState({showSpinner: true});
    axios({
        url: this.base_url+'sync',
        method: 'GET',
      }).then((response) => {
        if(response.data.success) {
          setTimeout( () => {
             if(response.data.code == 100 || response.data.code == 101 || response.data.code == 102) {
               this.getFilesData();
             }
             ToastStore.success(response.data.msg, this.toast_timeout, 'custom-toast-success');
             this.setState({showSpinner: false});
           }, 100);
        } else {
          ToastStore.error(response.data.msg, this.toast_timeout, 'custom-toast-success');
          this.setState({showSpinner: false});
        }
      });
  }

  dumpData() {
    this.setState({showSpinner: true});
    axios.post(this.base_url+'dump', {})
    .then( (response) => {
        response.data.files.forEach( (file) => {
          let model = {
            s3_url: 'https://c3-demo.s3.amazonaws.com/'+file,
            local_url: this.base_url+'download/'+file,
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
         ToastStore.success('50 Test Images are uploaded to S3', this.toast_timeout, 'custom-toast-success');
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
      ToastStore.info('Download is in progress...', this.toast_timeout, 'custom-toast-success');
    }
    axios({
        url: this.base_url+'download/'+is_s3_url+'/'+file,
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        if(response.data.size <= 47) {
          ToastStore.error('This file was not found in local disk', this.toast_timeout, 'custom-toast-error');
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
    this.setState({showSpinner: true});
    setTimeout( () => {
       this.getFilesData();
       this.setState({showSpinner: false});
     }, 100);
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
          if(fileNamesObj.length) {
            const deleteUrl = this.base_url+"delete-all";
            const httpReqHeaders = {
              'Content-Type': 'application/json'
            };
            const axiosConfigObject = {headers: httpReqHeaders, data: {file_names: fileNamesObj}};
            axios.delete(deleteUrl, axiosConfigObject).then((response)=>{
              const deleteUrl = this.base_url+"upload/idnotneed";
              const httpReqHeaders = {
                'Content-Type': 'application/json'
              };

              if(response.data.connectivity) {
                S3UploaderModelOperations.deleteAllFiles().then( (dbResp) => {
                  if(dbResp) {
                    this.state.listOfFiles.length = 0;
                    this.setState({listOfFiles: this.state.listOfFiles})
                    ToastStore.success(response.data.msg, this.toast_timeout, 'custom-toast-success');
                    this.setState({showSpinner: false});
                  }
                });
              } else {
                ToastStore.error(response.data.connectivityProb, this.toast_timeout, 'custom-toast-error');
                S3UploaderModelOperations.softDeleteAllFiles().then( (dbResp) => {
                  if(dbResp) {
                    this.state.listOfFiles.length = 0;
                    this.setState({listOfFiles: this.state.listOfFiles})
                    ToastStore.success(response.data.msg, this.toast_timeout, 'custom-toast-success');
                    this.setState({showSpinner: false});
                  }
                });
              }
            })
            .catch((err) => {
              ToastStore.error(err.response.data.msg, this.toast_timeout, 'custom-toast-error');
              this.setState({showSpinner: false});
            });
          } else {
            ToastStore.error('No files to delete', this.toast_timeout, 'custom-toast-error');
            this.setState({showSpinner: false});
          }
        });
      } else {
        S3UploaderModelOperations.getFileInfoById(delete_id).then( (dbResp) => {
          const deleteUrl = this.base_url+"upload/idnotneed";
          const httpReqHeaders = {
            'Content-Type': 'application/json'
          };
          const axiosConfigObject = {headers: httpReqHeaders, data: {file_name: dbResp.dataValues.file_name}};
          axios.delete(deleteUrl, axiosConfigObject).then((response)=>{
            if(response.data.connectivity) {
              S3UploaderModelOperations.deleteFile(delete_id).then( (deleteResp) => {
                this.state.listOfFiles.splice(rowIndex, 1);
                this.setState({listOfFiles: this.state.listOfFiles})
                ToastStore.success(response.data.msg, this.toast_timeout, 'custom-toast-success');
                this.setState({showSpinner: false});
              });
            } else {
              ToastStore.error(response.data.connectivityProb, this.toast_timeout, 'custom-toast-error');
              let deleteObj = {}
              deleteObj._id = delete_id;
              deleteObj.action_type = 'DELETE_FILE';
              deleteObj.connectivity = 0;
              deleteObj.is_deleted = 1;
              S3UploaderModelOperations.updateFile(deleteObj).then( (deleteResp) => {
                this.state.listOfFiles.splice(rowIndex, 1);
                this.setState({listOfFiles: this.state.listOfFiles})
                ToastStore.success(response.data.msg, this.toast_timeout, 'custom-toast-success');
                this.setState({showSpinner: false});
              });
            }

            if(typeof response.data.notFoundOnLocalDisk != 'undefined') {
              ToastStore.error(response.data.notFoundOnLocalDisk, this.toast_timeout, 'custom-toast-error');
            }
          })
          .catch((err) => {
            ToastStore.error(err.response.data.msg, this.toast_timeout, 'custom-toast-error');
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
          ToastStore.error(response.data.connectivityProb, this.toast_timeout, 'custom-toast-error');
        }

        S3UploaderModelOperations.newFile(model).then( (dbResp) => {
            if(dbResp) {
              let modelObj = dbResp.dataValues;
              modelObj.uploaded_on = this.getLocalTime(dbResp.dataValues.uploaded_on)
              modelObj.file_size = this.getFileSize(modelObj.file_size)
              this.state.listOfFiles.unshift(modelObj);
              this.setState({listOfFiles: this.state.listOfFiles});

              ToastStore.success(response.data.msg, this.toast_timeout, 'custom-toast-success')
              this.refs.uploadFile.value = '';
              this.state.file = '';
              this.setState({
                  fileName:null
              })
              this.setState({showSpinner: false});
            }
        });
      } else {
        ToastStore.error(response.data.err, this.toast_timeout, 'custom-toast-error');
        this.setState({showSpinner: false});
      }
    })
    .catch((err) => {
      ToastStore.error(err.response.data.err, this.toast_timeout, 'custom-toast-error');
      this.setState({showSpinner: false});
    });
  }

  onFileUpdate(e) {
    this.setState({updatefile: e.target.files[0]}, () => {
        let ext = this.state.updatefile.name.split('.').pop();
        let update_id = this.state.update_id;
        S3UploaderModelOperations.getFileInfoById(update_id).then( (dbResp) => {
          let fn = dbResp.dataValues.file_name.replace(/\.[^\.]+$/, '.'+ext)
          this.setState({showSpinner: true});
          const url = this.base_url+'upload/idnotneeded';
          const updateFormData = new FormData();
          updateFormData.append('file', this.state.updatefile)
          updateFormData.append('file_name', fn)
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
                ToastStore.error(response.data.connectivityProb, this.toast_timeout, 'custom-toast-error');
              }

              S3UploaderModelOperations.updateFile(model).then( (dbResp) => {
                let modelObj = dbResp.dataValues;
                modelObj.uploaded_on = this.getLocalTime(dbResp.dataValues.uploaded_on)
                modelObj.file_size = this.getFileSize(modelObj.file_size)
                this.state.listOfFiles[this.state.rowIndex] = modelObj
                this.setState({listOfFiles: this.state.listOfFiles});

                ToastStore.success(response.data.msg, this.toast_timeout, 'custom-toast-success')
                this.refs.uploadFile.value = '';
                this.state.file = '';
                this.state.update_id = null;
                this.state.rowIndex = null;
                this.state.updatefile = null;
                this.setState({showSpinner: false});
              });

            } else {
              ToastStore.error(response.data.err, this.toast_timeout, 'custom-toast-error');
              this.setState({showSpinner: false});
            }
          })
          .catch((err) => {
            ToastStore.error(err.response.data.err, this.toast_timeout, 'custom-toast-error');
            this.setState({showSpinner: false});
          });
        });
    });
  }

  onChange(e) {
    console.log(e.target.files);
    this.setState({file:e.target.files[0]})
    this.setState({
      fileName: e.target.files[0].name
    })
  }

  fileUpload(file){
    const url = this.base_url+'upload';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return axios.post(url, formData, config);
  }

  getSrc(fn, ft) {
    if(ft.search('image') != -1) {
      return '../node-api/uploads/'+fn;
    } else if(ft.search('pdf') != -1) {
      return '../resources/app-pdf-icon.png';
    } else if(ft.search('msword') != -1 || ft.search('document') != -1) {
      return '../resources/document-icon.png';
    }
  }

  onOpenModal = (finfo) => {
    this.setState({file_info: finfo})
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    return (
      <div className={styles.container} data-tid="container">
          <Modal open={open} onClose={this.onCloseModal} center styles={{modal: { 'color': 'black'}, closeButton: {'cursor': 'pointer'}}}>
            <table className="modalTable">
              <tbody>
                <tr>
                  <th>File Name:</th>
                  <td>{this.state.file_info.file_name}</td>
                </tr>
                <tr>
                  <th>File Type:</th>
                  <td>{this.state.file_info.file_type}</td>
                </tr>
                <tr>
                  <th>File Size:</th>
                  <td>{this.state.file_info.file_size}</td>
                </tr>
                <tr>
                  <th>Uploaded On:</th>
                  <td>{this.state.file_info.uploaded_on}</td>
                </tr>
                <tr>
                  <th>S3 URL:</th>
                  <td>{this.state.file_info.s3_url}</td>
                </tr>
                <tr>
                  <th>Local URL:</th>
                  <td>{this.state.file_info.local_url}</td>
                </tr>
                <tr>
                  <th>Connectivity:</th>
                  <td>{this.state.file_info.connectivity ? 'ONLINE' : 'OFFLINE'}</td>
                </tr>
              </tbody>
            </table>
          </Modal>
          { this.state.showSpinner ? <SpinnerComponent/> : null }
          <form className="uploader-form" onSubmit={this.onFormSubmit}>
            <h3 className="text-center"><i className="fas fa-cloud-upload-alt"></i> S3 Uploader</h3>
            <div className="upload-input-wrapper">
              <div className="upload-input">
                  <input className="uploadable-input d-none" id="uploadLocalFile" name="uploadLocalFile" type="file" onChange={this.onChange} ref="uploadFile" accept='application/msword, application/pdf, image/*, application/vnd.openxmlformats-officedocument.wordprocessingml.document' multiple/>
                  <label htmlFor="uploadLocalFile">{this.state.fileName ? this.state.fileName : "Click here to Upload file.."}</label>
                  <button type="submit">
                    Upload to S3
                  </button>
              </div>
              <input type="file" onChange={this.onFileUpdate} ref="selectUpdateFile" style={{display: "none"}} accept='application/msword, application/pdf, image/*, application/vnd.openxmlformats-officedocument.wordprocessingml.document'/>
            </div>
            <div className="upload-buttons-wrapper d-flex align-items-center justify-content-around">
              <button type="button" onClick={() => this.deleteFile('all', null)}>
                Delete All Files
              </button>
              <button type="button" onClick={() => this.dumpData()}>
                Upload Dummy Data
              </button>
              <button type="button" onClick={() => this.sync()}>
                SYNC
              </button>
            </div>
            <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_RIGHT} lightBackground/>
          </form>
          <div className="uploaded-table-wrapper">
            <ReactTable
              data={this.state.listOfFiles}
              showPageSizeOptions= {false}
              defaultPageSize= {10}
              noDataText= {'No files found'}
              columns={[
                {
                  columns: [
                    {
                      Header: "File Name",
                      accessor: "file_name",
                      Cell: row => (
                        <div className="d-flex align-items-center">
                          <div className="thumb" onClick={() => this.onOpenModal(row.original)}><img src={this.getSrc(row.original.file_name, row.original.file_type)} width="75" height="75"/></div>
                          <div>{row.original.file_name}</div>
                        </div>
                      )
                    },
                    {
                      Header: "File Type",
                      accessor: "file_type",
                      sortable: false
                    },
                    {
                      Header: "File Size",
                      accessor: "file_size"
                    },
                    {
                      Header: "Uploaded On",
                      accessor: "uploaded_on"
                    },
                    {
                      Header: "Action",
                      sortable: false,
                      Cell: row => (
                        <div>
                          <span onClick={() => this.selectUpdateFile(row.original._id, row.index)}><i className="fas fa-upload hover"></i></span>
                          <span> / </span>
                          <span onClick={() => this.deleteFile(row.original._id, row.index)}><i className="fas fa-trash hover"></i></span>
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
                  <div className="uploaded-file-details d-flex align-items-center justify-content-around">
                    <Label>
                      <small>S3 url : </small>
                      <Link href="javascript:void(0);" color="white" onClick={() => this.onOpenModal(row.original)}>
                        {row.original.s3_url}
                      </Link>
                    </Label>
                    <Label>
                      <small>Local url : </small>
                      <Link href="javascript:void(0);" color="white" onClick={() => this.onOpenModal(row.original)}>
                        {row.original.local_url}
                      </Link>
                    </Label>
                  </div>
                )
              }
            }
          />
        </div>
      </div>
    );
  }
}
