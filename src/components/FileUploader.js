import React, {Component} from 'react'
import {uploadHandler} from "../api"
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

  uploadFile = async (addJob, file) => {
    try {
      await uploadHandler(addJob,file)
    } catch(err) {
      console.error('could not upload file', err.toString())
    }
  }


  render() {

    const {state: {file}} = this

    return (
      <Mutation mutation={this.ADD_JOB}>
        {(addJob, {data}) => (

          <form onSubmit={e => {e.preventDefault();this.uploadFile( addJob, file)}}>
            <input type="file" onChange={this.onChange}/>
            <button type="submit">Upload</button>
          </form>
        )}
      </Mutation>
    )


  }


}

export default FileUploader
