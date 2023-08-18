<template>
  <template v-if="showAppInstallBanner">
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
    <q-btn-group glossy outline rounded v-if="menu" class="q-mb-md">
      <q-btn
        @click="installApp"
        padding="10"
        class="text-no-wrap no-wrap"
        color="blue-grey-8"
        label="Instalar"
        no-caps
        outline
        icon="mdi-cellphone-arrow-down"
      />
      <q-btn
        padding="10"
        color="blue-grey-8"
        icon="mdi-close"
        v-close-popup
        outline
      />
  </q-btn-group>
  </template>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { LocalStorage } from 'quasar'
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
      LocalStorage.set('neverShowAppInstallBanner', true)
    }


    onMounted(() => {
      if (!deferredPrompt?.prompt) neverShowINstallBanner()

    })

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
