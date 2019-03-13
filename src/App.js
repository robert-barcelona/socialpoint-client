import React, {Component} from 'react';

import {ApolloProvider} from "react-apollo"
import {ApolloClient} from "apollo-client"
import {ApolloLink} from 'apollo-boost'
import {onError} from 'apollo-link-error'

import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'

import FileUploader from './components/FileUploader'
import Jobs from './components/Jobs'
import 'bulma/css/bulma.css'
import  './main.scss'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})

const errorLink = onError(({graphQLErrors}) => {
  if (graphQLErrors) graphQLErrors.map(({message}) => console.log(message))
})


const client = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache()
})


class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className=' hero'>
        <div className=' hero-body is-size-2 has-text-warning has-background-link'>Nifty PNG->JPG Converter!</div>
        </div>
        <div className='columns'>
          <div className='column is-one-fifth '></div>
        <div className=' column is-one-third '>
            <FileUploader/>

        </div>
        <div className=' column  is-one-third'>
          <Jobs/>
        </div>
        </div>
      </ApolloProvider>

    );
  }
}

export default App;
