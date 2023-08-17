<template>
  <template v-if="!neverShowAppInstallBanner">
    <action-button
      v-if="false"
      @click="installApp"
      class="q-mt-md text-caption"
      text-color="light-blue-10"
      padding="10px"
      dense
      label="Instala nuestra app"
    >
      <template #icon>
        <q-icon
          class="q-pr-xs"
          name="mdi-cellphone-arrow-down"
        />
      </template>
    </action-button>
    <q-banner
      v-if="signUp"
      :class="top && 'absolute-top'"
      class="z-top q-py-md q-pl-none animated fadeIn banner banner-signup"
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
          name="mdi-cellphone-arrow-down"
        />
      </div>
    </q-banner>
    <q-banner
      class="z-top animated fadeIn banner-menu q-px-none banner"
      :class="menu ? '' : 'q-pb-none'"
      style="animation-delay: 0.2s;"
      dense
    >
        <div class="col-12 q-px-md">
          Añade facilmente nuestra app a tu pantalla de inicio solo pulsando en instalar.
        </div>
        <div class="row justify-between">
          <action-button
            @click="showAppInstallBanner = false"
            flat
            class="q-mt-md "
            label="Ahora no"
            text-color="light-blue-1"
          />
          <action-button
            class="q-mt-md q-mr-md"
            label="Añadir a pantalla de inicio"
            text-color="light-blue-3"
            icon="mdi-cellphone-arrow-down"
          />

          <slot name="extraInfo" />
      </div>
    </q-banner>
  </template>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { LocalStorage, useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'

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
    const showAppInstallBanner = ref(true)
    const neverShowAppInstallBanner = LocalStorage.getItem('neverShowAppInstallBanner')

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
    return {
      deferredPrompt,
      installApp,
      showAppInstallBanner,
      neverShowAppInstallBanner
    }
  }
})
</script>

<style lang="scss">

.banner {
  color: $light-blue-1 !important;
  background: $blue-grey-9;
  padding: 20px 0px;
}

.banner-signup {
  border-top: 5px solid $dark;
}

</style>
