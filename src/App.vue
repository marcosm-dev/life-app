<template>
  <router-view />
</template>

<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent, watchEffect } from 'vue'
import { useAuthStore, NewUser } from './stores/auth'

export default defineComponent({
  name: 'App',
  setup() {
    const authStore = useAuthStore()

    const { result } = useQuery(gql`
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
          }
        }
    `)

    watchEffect(() => {
      if(result.value) {
        const user: NewUser = result.value?.me
        authStore.setUser(user)
      }
    })
  }
})
</script>
