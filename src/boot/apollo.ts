import { boot } from 'quasar/wrappers'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink
} from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { LocalStorage } from 'quasar'
import { logErrorMessages } from '@vue/apollo-util'
import useHandleGraphqlErrors from 'src/composables/useHandleError'
import { useAuthStore } from 'src/stores/auth'
import useNotifyError from 'src/composables/useNotifyError'

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = LocalStorage.getItem('token')
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  return forward(operation)
})

export default boot(({ app, router, store }) => {
  const authStore = useAuthStore(store)
  const errorMiddleware = onError((error) => {
    const { graphQLErrors } = error
    if (graphQLErrors?.length) {
      for (const err of graphQLErrors) {
        if (err.message.toLowerCase() === 'unauthorized') {
          authStore.$reset()
          LocalStorage.clear()
          apolloClient.clearStore()
          router.push('/auth')
          useNotifyError({ message: 'No authorizado' })
        } else {
          useHandleGraphqlErrors(err)
          logErrorMessages(error)
          if (err.message.includes('token')) {
            router.push('/auth/sign-in')
          }
        }
      }
    }
  })

  const httpLink = new HttpLink({
    uri: process.env.APOLLO_URI,
    fetch: async (uri, options) => {
      return fetch(uri, options)
    }
  })

  const apolloClient = new ApolloClient({
    link: from([authMiddleware, errorMiddleware, httpLink]),
    cache: new InMemoryCache()
  })

  app.provide(DefaultApolloClient, apolloClient)
})
