import React, {Component} from 'react'
import axios from 'axios'
import {Query} from 'react-apollo'
import gql from 'graphql-tag'


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

  render() {


    return (
      <Query query={this.JOBS_QUERY} pollInterval={1000}>
        {({loading, error, data}) => {
          if (loading) return <div>Loading...</div>
          if (error) return <div>{`${error.toString()}`}</div>
          if (!data || !data.jobs) return <div>No jobs</div>
          this.jobs = data.jobs // ugly, but no time to get into caching and Apollo Client
          console.log(this.jobs)
          return (<ul>
            {data.jobs.map(job => <li key={job.id}>Job ID: {job.id}, Image name: {job.fileCrypt}, Image
              Source: {job.file}. Status: {job.status }</li>)}
          </ul>)
        }
        }
      </Query>
    )


  }

}

export default Jobs;
