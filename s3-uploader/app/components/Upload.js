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
  }

  selectUpdateFile(id , rowIndex) {
    this.refs.selectUpdateFile.click();
    this.state.update_id = id;
    this.setState({rowIndex: rowIndex});
  }

  deleteFile(id, rowIndex) {
    if(confirm("Are you sure want to delete this file ?")) {


      const deleteUrl = "http://localhost:3000/upload/"+id;
      const httpReqHeaders = {
        'Content-Type': 'application/json'
      };
      const axiosConfigObject = {headers: httpReqHeaders};
      axios.delete(deleteUrl, axiosConfigObject).then((response)=>{
        if(typeof response.data.connectivityProb != 'undefined') {
          ToastStore.error(response.data.connectivityProb);
        }
        if(response.data.success) {
          this.state.listOfFiles.splice(rowIndex, 1);
          this.setState({listOfFiles: this.state.listOfFiles})
          ToastStore.success(response.data.msg);
        }
      })
      .catch((err) => {
        ToastStore.error(err.response.data.msg);
      });
    }
  }

  downloadFile(file, s3_url) {
    let is_s3_url = s3_url!='' ? 'S3' : 'LOCAL'
    if(is_s3_url == 'S3') {
      ToastStore.info('Download is in progress...');
    }
    axios({
        url: 'http://localhost:3000/download/'+is_s3_url+'/'+file,
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file);
        document.body.appendChild(link);
        link.click();
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
    axios.get('http://localhost:3000/list-files').then(response => {
      let listOfFiles = [];
      response.data.files.map((key) => {
        let dateFormat = 'YYYY-MM-DD HH:mm:ss';
        let testDateUtc = moment.utc(key.uploaded_on);
        let localDate = testDateUtc.local();
        listOfFiles.push({'id': key._id, 'file_name': key.file_name, 'file_type': key.file_type, 'file_size': Math.round(key.file_size/1000) + ' KB', 'uploaded_on': this.getLocalTime(key.uploaded_on), 's3_url': key.s3_url, 'local_url': key.local_url})
      });

      this.setState({listOfFiles: listOfFiles});
    });
  }

  onFormSubmit(e){
    e.preventDefault();
    if(this.state.file != null)
    this.setState({showSpinner: true});
    this.fileUpload(this.state.file).then((response)=>{
      if(typeof response.data.success != 'undefined' && response.data.success) {
        if(typeof response.data.connectivityProb != 'undefined') {
          ToastStore.error(response.data.connectivityProb);
        }
        this.state.listOfFiles.unshift(response.data.data);
        this.state.listOfFiles[0].file_size = Math.round(response.data.data.file_size/1000) + ' KB'
        this.state.listOfFiles[0].uploaded_on = this.getLocalTime(response.data.data.uploaded_on)
        this.setState({listOfFiles: this.state.listOfFiles});

        ToastStore.success(response.data.msg)
        this.refs.uploadFile.value = '';
        this.state.file = '';
        this.setState({showSpinner: false});
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

  onChange(e) {
    this.setState({file:e.target.files[0]})
  }

  onFileUpdate(e) {
    this.setState({updatefile: e.target.files[0]}, () => {
        this.setState({showSpinner: true});
        const url = 'http://localhost:3000/upload/'+this.state.update_id;
        const updateFormData = new FormData();
        updateFormData.append('file',this.state.updatefile)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        axios.put(url, updateFormData, config).then((response)=>{
          if(typeof response.data.success != 'undefined' && response.data.success) {
            if(typeof response.data.connectivityProb != 'undefined') {
              ToastStore.error(response.data.connectivityProb);
            }
            this.state.listOfFiles[this.state.rowIndex] = response.data.data
            this.state.listOfFiles[this.state.rowIndex].file_size = Math.round(response.data.data.file_size/1000) + ' KB'
            this.state.listOfFiles[this.state.rowIndex].uploaded_on = this.getLocalTime(response.data.data.uploaded_on)
            this.setState({listOfFiles: this.state.listOfFiles});

            ToastStore.success(response.data.msg)
            this.refs.uploadFile.value = '';
            this.state.file = '';
            this.state.update_id = null;
            this.state.rowIndex = null;
            this.state.updatefile = null;
            this.setState({showSpinner: false});
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
                      <span onClick={() => this.selectUpdateFile(row.original.id, row.index)}><i className="fas fa-upload hover"></i></span>
                      <span> / </span>
                      <span onClick={() => this.deleteFile(row.original.id, row.index)}><i className="fas fa-times hover"></i></span>
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
