import { useQuery } from '@vue/apollo-composable'
import useAuth from './useAuth'
import gql from 'graphql-tag'

import { computed, toRef, watchEffect } from 'vue'
// import { useRouter } from 'vue-router'
import { LocalStorage } from 'quasar'

const useMe = () => {
  // const router = useRouter()
  const { store } = useAuth()

  const { result } = useQuery(
    gql`
      query me {
        me {
          id
          name
          lastName
          VATIN
          phone
          zipCode
          city
          address
          email
          uuid
          token
        }
      }
    `,
    null, () => ({ enabled: !!LocalStorage.getItem('token') })
  )

  const me = computed(() => result.value?.me)

  watchEffect(() => {
    if (result.value) {
       store.setUser(me.value)
    }
  })

  return {
    me: toRef(me)
  }
}

export default useMe
