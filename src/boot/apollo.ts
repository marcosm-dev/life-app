import { boot } from 'quasar/wrappers';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink
} from '@apollo/client/core';
import { onError, ErrorResponse } from '@apollo/client/link/error';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { LocalStorage } from 'quasar';
import { logErrorMessages } from '@vue/apollo-util';

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = LocalStorage.getItem('token');
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return forward(operation);
});

export default boot(({ app, router }) => {
  const errorMiddleware = onError((error) => {
    const { graphQLErrors } = error;
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.message.toLowerCase() === 'unauthenticated') {
          router.push('/login');
        } else {
          logErrorMessages(error);
        }
      }
    }
  });

  const httpLink = new HttpLink({
    uri: process.env.APOLLO_URI,
    fetch: async (uri, options) => {
      return fetch(uri, options);
    }
  });

  const apolloClient = new ApolloClient({
    link: from([authMiddleware, errorMiddleware, httpLink]),
    cache: new InMemoryCache()
  });

  app.provide(DefaultApolloClient, apolloClient);
});
