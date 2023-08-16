<template>
  <router-view />
</template>

<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent, watchEffect, onMounted, ref } from 'vue'
import { useAuthStore, NewUser } from './stores/auth'
import { ionDownloadOutline } from '@quasar/extras/ionicons-v7'
import { BeforeInstallPromptEvent } from './components/models'
import { LocalStorage } from 'quasar'


export default defineComponent({
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    const { setDeferredPrompt } = useAuthStore()
    const showAppInstallBanner = ref(false)

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
    `, null, { enabled: !!LocalStorage.getItem('token')})


    watchEffect(() => {
      if(result.value) {
        const user: NewUser = result.value?.me
        authStore.setUser(user)
      }
    })
    return {
      ionDownloadOutline,
      showAppInstallBanner
    }
  }
})
</script>
