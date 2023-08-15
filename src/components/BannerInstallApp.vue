<template>
  <router-view />
    <q-banner
      :class="top && 'absolute-top'"
      v-if="!showAppInstallBanner"
      class="z-top q-py-md q-pl-none animated fadeIn"
      style="background: #0267b6F7; animation-delay: 0.2s;"
      dense
    >
      <div class="row">
        <q-btn
          flat
          color="positive"
          icon="mdi-close"
          size="18px"
        />
        <div class="col q-gutter-y-sm text-positive">
          <div class="text-bold text-subtitle1">
            Serpica life
          </div>
          <div class="text-body2" style="line-height: 1.2; font-weight: 500;">
              Instala nuestra <strong>app</strong> de forma rápida, sencilla y sin ocupar espacio en tu dispositivo.
          </div>
        </div>
        <!-- <q-img
          src="src/assets/logo.jpg"
          class="rounded-borders col"
          height="50px"
          width="50px"
        /> -->
        <q-icon
          @click="installApp"
          class="col-auto q-my-auto q-px-sm q-py-sm rounded-borders animated fadeIn"
          style="animation-delay: ,2s;"
          color="positive"
          size="40px"
          v-ripple.center
          :name="ionDownloadOutline"
        />
      </div>
  </q-banner>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar'
import { ionDownloadOutline } from '@quasar/extras/ionicons-v7'
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  name: 'App',
  props: ['top'],
  setup() {
    const $q = useQuasar()
    const { deferredPrompt } = useAuthStore()
    const showAppInstallBanner = ref(false)

    function installApp() {
      showAppInstallBanner.value = false
      deferredPrompt.prompt()

      deferredPrompt.userChoise.then((chouseResult: any) => {
          if (chouseResult.outcome === 'accepted') {
            console.log(chouseResult)
            neverShowINstallBanner()
          }
      })

    }

    function neverShowINstallBanner() {
      showAppInstallBanner.value = false
      $q.localStorage.set('neverShowAppInstallBanner', true)
    }

    onMounted(() => {
      let neverShowAppInstallBanner = $q.localStorage?.getItem('neverShowAppInstallBanner')

      if (!neverShowAppInstallBanner) {
        window.addEventListener('beforeinstallprompt', (e) => {
          console.log(e)
          deferredPrompt.value = e
          showAppInstallBanner.value = true
        })
      }
    })

    return {
      installApp,
      ionDownloadOutline,
      showAppInstallBanner
    }
  }
})
</script>
