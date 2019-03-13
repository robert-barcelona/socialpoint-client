import React, {Component} from 'react'
import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload, faTrashAlt, faFileDownload, faArrowAltCircleDown} from '@fortawesome/free-solid-svg-icons'
import  '../main.scss'

import {downloadHandler} from '../api'

library.add(faDownload, faTrashAlt, faFileDownload, faArrowAltCircleDown)

class Jobs extends Component {

  state = {
    apiError: null
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


  DELETE_JOB = gql`
      mutation DeleteJob($id: ID!) {
          deleteJob(id: $id) {
            status
          }
      }
  `;


  downloadFile = async (file, fileCrypt) => {
    try {
      await downloadHandler(file, fileCrypt)
      this.setState({apiError: null})

    } catch (err) {
      this.setState({apiError: err.toString()})
    }
  }

  deleteFile = async (deleteJob,id) => {
    try {
      console.log('id',id)
      await deleteJob({variables: {id}});
      this.setState({apiError: null})
    } catch (err) {
      this.setState({apiError: err.toString()})
    }
  }

  render() {

    const {state: {apiError}} = this

    return (
      <div className='columns'>
        <div className='column is-half'>

          <Query query={this.JOBS_QUERY} pollInterval={500}>
            {({loading, error, data}) => {
              if (loading) return <div>Loading...</div>

              if (error) return <div className='message is-warning'>
                <div className="message-header">
                  {`${error.toString()}`}</div>
              </div>

              if (!data || !data.jobs) return <div>No jobs</div>
              return (<div> {apiError && <div className='message is-warning'>
                <div className="message-header">
                  {apiError}</div>
              </div>
              }
                <ul className='list'>
                  {data.jobs.map(job => <li className='jobListItem has-text-warning has-background-link' key={job.id}>Image: {job.file},
                    Status: {job.status}
                    {job.status === 'COMPLETED' &&
                    <a href='#' className='list-item' onClick={e => {
                      e.preventDefault();
                      this.downloadFile(job.file, job.fileCrypt)
                    }}>Download Image <FontAwesomeIcon
                      icon='arrow-alt-circle-down'/></a>}
                    <Mutation mutation={this.DELETE_JOB}>
                      {(deleteJob, {data, error}) => (
                        <a href='#' className='list-item' onClick={e => {
                          e.preventDefault();
                          this.deleteFile(deleteJob,job.id)
                        }}>Delete Job <FontAwesomeIcon
                          icon='trash-alt'/></a>
                      )}

                    </Mutation>
                  </li>)}
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
