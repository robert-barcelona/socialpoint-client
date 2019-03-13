import React, {Component} from 'react'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload, faFileDownload, faArrowAltCircleDown} from '@fortawesome/free-solid-svg-icons'
import {downloadHandler} from '../api'

library.add(faDownload, faFileDownload, faArrowAltCircleDown)

class Jobs extends Component {

  state = {
    downloadError: null
  }


  JOBS_QUERY = gql`
      {
          jobs {
              id
              file
              fileCrypt
              status
          }
      }
  `

  downloadFile = async (file, fileCrypt) => {
    try {
      await downloadHandler(file, fileCrypt)
      this.setState({downloadError: null})

    } catch (err) {
      this.setState({downloadError: err.toString()})
    }
  }

  render() {

    const {state: {downloadError}} = this

    return (
      <div className='columns'>
        <div className='column is-half'>

          <Query query={this.JOBS_QUERY} pollInterval={1000}>
            {({loading, error, data}) => {
              if (loading) return <div>Loading...</div>

              if (error) return <div className='message is-warning'>
                <div className="message-header">
                  {`${error.toString()}`}</div>
              </div>

              if (!data || !data.jobs) return <div>No jobs</div>
              return (<div> {downloadError && <div className='message is-warning'>
                <div className="message-header">
                  {downloadError}</div>
              </div>
              }
                <ul className='list'>
                  {data.jobs.map(job => <li key={job.id}>Image: {job.file},
                    Status: {job.status} {job.status === 'COMPLETED' &&
                    <a className='list-item' onClick={e => {
                      e.preventDefault();
                      this.downloadFile(job.file, job.fileCrypt)
                    }}>Click to download <FontAwesomeIcon
                      icon='arrow-alt-circle-down'/></a>}</li>)}
                </ul>
              </div>)
            }
            }
          </Query>
        </div>

      </div>
    )


  }

}

export default Jobs;
