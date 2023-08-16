<template v-if="!showAppInstallBanner">
    <action-button
      v-if="menu"
      @click="installApp"
      class="q-mt-md text-caption"
      text-color="light-blue-10"
      padding="10px"
      dense
      label="Instala nuestra app"
      :icon-right="ionDownloadOutline"
    />
    <q-banner
      v-else-if="signUp"
      :class="top && 'absolute-top'"
      class="z-top q-py-md q-pl-none animated fadeIn banner-signup"
      style="animation-delay: 0.2s;"
      dense
    >
      <div class="row">
        <q-btn
          flat
          color="positive"
          icon="mdi-close"
          size="18px"
          v-close-popup
        />
        <div class="col q-gutter-y-sm text-indigo-2">
          <div class="text-bold text-subtitle1">
            Serpica life
          </div>
          <div class="text-body2" style="line-height: 1.2; font-weight: 500;">
              Instala nuestra <strong>app</strong> de forma rápida, sencilla y sin ocupar espacio en tu dispositivo.
          </div>
        </div>
        <q-icon
          @click="installApp"
          class="col-auto q-my-auto q-px-sm q-py-sm rounded-borders animated fadeIn"
          style="animation-delay: ,2s;"
          color="light-blue-1"
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
import { useAuthStore } from 'stores/auth';

export default defineComponent({
  name: 'App',
  props: {
    dense: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false,
    },
    menu: Boolean,
    signUp: Boolean,
  },
  setup() {
    const $q = useQuasar()
    const { deferredPrompt } = useAuthStore()
    const showAppInstallBanner = ref(false)

    function installApp() {
      showAppInstallBanner.value = false

      if (!Object.values(deferredPrompt).length) return


      deferredPrompt.prompt()
      deferredPrompt?.userChoise.then((chouseResult: any) => {
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
      // let neverShowAppInstallBanner = $q.localStorage?.getItem('neverShowAppInstallBanner')

      // if (!neverShowAppInstallBanner) {
      //   window.addEventListener('beforeinstallprompt', (e) => {
      //     deferredPrompt.value = e
      //     showAppInstallBanner.value = true
      //   })
      // }
    })


    return {
      installApp,
      ionDownloadOutline,
      showAppInstallBanner
    }
  }
})
</script>

<style lang="scss">

.banner-signup {
  border-top: 5px solid $dark;
  background: rgb(2,103,182);
}
</style>
