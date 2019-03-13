import React, {Component} from 'react'
import {uploadHandler} from "../api"
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

class FileUploader extends Component {

  state = {
    file: null,
    uploadError: null,
  }

  inputRef = React.createRef()

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

  uploadFile = async (e, addJob, file) => {
    e.preventDefault()

    this.inputRef.current.value = ''
    if (!file) return
    if (file.name.split('.')[1].toLowerCase() !== 'png') {
      this.setState({file:'',uploadError:'The file must be a PNG image'})
      return
    }
    try {
      await uploadHandler(addJob, file)
      this.setState({file:'',uploadError: null})

    } catch (err) {
      this.setState({file:'',uploadError: err.toString()})
    }
  }


  render() {

    const {state: {uploadError,file}} = this

    return (
      <Mutation mutation={this.ADD_JOB}>
        {(addJob, {data, error}) => {


          return (<div>
            {error && <div className='message is-warning'>
              <div className="message-header">
                {`${error.toString()}`}</div>
            </div>
        }
            {uploadError && <div className='message is-warning'>
              <div className="message-header">
                {uploadError}</div>
            </div>
            }
          <form onSubmit={e => {
            this.uploadFile(e, addJob, file)
          }}>
            <div className="field">
              <label className="label">Upload your image</label>
              <div className="control">
                <input className="input" ref={this.inputRef} type="file" onChange={this.onChange}/>
              </div>
            </div>
            <button className='button is-primary' type="submit">Upload</button>
          </form>
          </div> )
        }}
      </Mutation>
    )


  }


}

export default FileUploader
