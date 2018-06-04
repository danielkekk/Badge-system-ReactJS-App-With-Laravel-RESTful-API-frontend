import React from 'react'
import {Button} from 'react-bootstrap';
import axios, { post } from 'axios';

class FileUploadComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file:null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }
  
  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file).then((response)=>{
        console.log(response.status);
        this.props.refresh();
    }).catch((error) => {
        console.log(error.response.data.message);
        this.props.createErrorMessage(error.response.data.message);
    });
  }
  
  onChange(e) {
    this.setState({file:e.target.files[0]})
  }
  
  fileUpload(file) {
    const url = 'http://localhost:8000/api/fileupload';
    const formData = new FormData();
    formData.append('file',file);
    formData.append('badgeid',this.props.badgeId);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    
    return post(url, formData, config);
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <br />
        <input type="file" onChange={this.onChange} />
        <br />
        <Button type="submit">Upload</Button>
      </form>
   )
  }
}

export default FileUploadComponent;