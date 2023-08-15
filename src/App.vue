<template>
  <router-view />
</template>

<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { defineComponent, watchEffect, onMounted, ref } from 'vue';
import { useAuthStore, NewUser } from './stores/auth'
import { ionDownloadOutline } from '@quasar/extras/ionicons-v7'
import { BeforeInstallPromptEvent } from './components/models';

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
    `)

    onMounted(() => {
      const beforeInstallHandler = (e: Event) => {
        // Verificar si el evento es realmente un BeforeInstallPromptEvent
        if ((e as BeforeInstallPromptEvent).platforms) {
          const beforeInstallPromptEvent = e as BeforeInstallPromptEvent

          // Por ejemplo, si quisieras mostrar la solicitud de instalación manualmente:
          setDeferredPrompt(beforeInstallPromptEvent)
        }
      }

      window.addEventListener('beforeinstallprompt', beforeInstallHandler)
    })

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
