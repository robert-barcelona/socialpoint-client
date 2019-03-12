import React, {Component} from 'react';

import {ApolloProvider} from "react-apollo"
import {ApolloClient} from "apollo-client"
import {ApolloLink} from 'apollo-boost'
import {onError} from 'apollo-link-error'

import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'

import FileUploader from './components/FileUploader'
import Jobs from './components/Jobs'


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

      <div className="App">
        <FileUploader/>
      </div>
        <div><Jobs/></div>
      </ApolloProvider>

    );
  }
}

export default App;
