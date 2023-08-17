<template>
  <router-view />
</template>

<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent, watchEffect, onMounted, ref } from 'vue'
import { useAuthStore, NewUser } from './stores/auth'
import { BeforeInstallPromptEvent } from './components/models'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'


export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter()
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

    const beforeInstallHandler = (e: Event) => {

      // Verificar si el evento es realmente un BeforeInstallPromptEvent
      if ((e as BeforeInstallPromptEvent).platforms) {
        const beforeInstallPromptEvent = e as BeforeInstallPromptEvent
        // Por ejemplo, si quisieras mostrar la solicitud de instalación manualmente:
        setDeferredPrompt(beforeInstallPromptEvent)
      }
    }

    onMounted(() => {
      const neverShowAppInstallBanner = LocalStorage.getItem('neverShowAppInstallBanner')
      if (!neverShowAppInstallBanner) {
        window.addEventListener('beforeinstallprompt', beforeInstallHandler)
      }
    })

    watchEffect(() => {
      if(result.value) {
        const user: NewUser = result.value?.me
        authStore.setUser(user)
      }
    })
    return {
      showAppInstallBanner
    }
  }
})
</script>
