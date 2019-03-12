import React, {Component} from 'react'
import axios from 'axios'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

class FileUploader extends Component {

  state = {
    file: null
  }

  ADD_JOB = gql`
      mutation AddJob($file: String!, $fileCrypt:String!) {
          addJob(file: $file, fileCrypt: $fileCrypt) {
              id
              file
              status
          }
      }
  `;


  onChange = event => {
    event.preventDefault()
    this.setState({file: event.target.files[0]})
  }


  uploadHandler = (event, addJob) => {
    event.preventDefault()
    const file = this.state.file;
    const formData = new FormData()
    formData.append(
      'xxzzy',
      file,
      file.name
    )

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const url = `${process.env.REACT_APP_IMAGE_UPLOAD_SERVER}/upload`
    axios.post(url, formData, config)
      .then(response => {
        console.log('file uploaded', response)
        const fileCrypt = response.data.file.split('/')[1]
        return addJob({variables: {file:file.name, fileCrypt}});
      })
      .then(result => console.log('new job created', result.toString()))
      .catch(err => console.error('file upload error', err.toString()))
  }

  render() {


    return (
      <Mutation mutation={this.ADD_JOB}>
        {(addJob, {data}) => (

          <form onSubmit={e => this.uploadHandler(e, addJob)}>
            <input type="file" onChange={this.onChange}/>
            <button type="submit">Upload</button>
          </form>
        )}
      </Mutation>
    )


  }


}

export default FileUploader
