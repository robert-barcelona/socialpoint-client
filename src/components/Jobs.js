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
              completed
          }
      }
  `

  render() {


    return (
      <Query query={this.JOBS_QUERY}>
          {({loading, error, data}) => {
            if (loading) return <div>Loading...</div>
            if (error) return <div>{`${error.toString()}`}</div>
            if (!data || !data.jobs) return <div>No jobs</div>

            return (<ul>
              {data.jobs.map(job => <li key={job.id}>Job ID: {job.id}, Image name: {job.file}, Completed: {job.completed ? "true" : "false"}</li>)}
            </ul>)
          }
        }
      </Query>
    )


  }

}

export default Jobs;
