import React, {Component} from 'react'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload, faFileDownload, faArrowAltCircleDown} from '@fortawesome/free-solid-svg-icons'
import {downloadHandler} from '../api'

library.add(faDownload, faFileDownload, faArrowAltCircleDown)

class Jobs extends Component {


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

  downloadFile = async (file,fileCrypt) => {
    try {
      await downloadHandler(file, fileCrypt)
    } catch (err) {
      console.error('file could not be downloaded:', err.toString())
    }
  }

  render() {


    return (
      <Query query={this.JOBS_QUERY} pollInterval={1000}>
        {({loading, error, data}) => {
          if (loading) return <div>Loading...</div>
          if (error) return <div>{`${error.toString()}`}</div>
          if (!data || !data.jobs) return <div>No jobs</div>
          return (<ul>
            {data.jobs.map(job => <li key={job.id}>Image: {job.file},
              Status: {job.status} {job.status === 'COMPLETED' &&
              <span onClick={e => {e.preventDefault();this.downloadFile(job.file, job.fileCrypt)}}>Click to download <FontAwesomeIcon
                icon='arrow-alt-circle-down'/></span>}</li>)}
          </ul>)
        }
        }
      </Query>
    )


  }

}

export default Jobs;
