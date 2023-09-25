<template>
  <transition leave-active-class="animated fadeOut">
    <template v-if="!hideBanner">
      <q-banner
        key="banner-classic"
        v-if="['Payment', 'SignUp'].includes(type)"
        :class="type === 'SignUp' && 'rounded-banner-bottom'"
        class="animated fadeIn q-py-md full-width bg-primary text-white absolute-bottom"
        style="animation-delay: 0.2s"
        dense
      >
        <div class="row">
          <q-btn
            flat
            color="positive"
            icon="mdi-close"
            class="q-pl-none q-pr-xs"
            size="16px"
            @click="hideInstallPromotion"
          />
          <div class="col q-gutter-y-sm">
            <div class="text-bold">
              {{  name }}
            </div>
            <div
              class="text-caption q-mt-xs q-pr-md text-info"
              style="line-height: 1.2; font-weight: 500"
            >
              {{ $t('banner.title') }}
            </div>
          </div>
          <q-btn
            @click="installApp"
            icon-right="mdi-download"
            class="col-auto q-my-auto q-px-sm q-py-sm text-bold"
            style="animation-delay: , 2s"
            no-caps
            square
            text-color="blue-grey-8"
            color="lime-13"
            padding="10px 20px"
            :label="$t('banner.actionButtonLabel')"
          />
        </div>
      </q-banner>
      <q-btn-group
          v-else-if="type === 'Menu'"
          key="menu"
          outline
          class="bg-white q-my-md items-center text-bold"
          rounded
        >
          <q-btn
            @click="installApp"
            flat
            no-caps
          >
              <q-icon
                name="mdi-close-outline"
                size="18px"
                @click="hideInstallPromotion"
                color="blue-grey-10"
              />
          </q-btn>
            <label class="q-ml-auto">
              {{ $t('banner.install') }}
            </label>
            <q-btn
              @click="installApp"
              flat
              no-caps
              color="light-blue-9"
              icon="mdi-plus-circle-outline"
            />
      </q-btn-group>
        <q-btn
          v-else-if="type === 'Header'"
          icon-right="mdi-download"
          size="12px"
          padding="4px 10px"
          class="q-mt-auto q-ml q-mr-sm q-mb-lg text-bold"
          color="lime-13"
          text-color="blue-grey-8"
          dense
          square
          @click="installApp"
          :label="$t('banner.install')"
          no-caps
      />
    </template>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { LocalStorage } from 'quasar'
import useAuth from 'src/composables/useAuth'
import { name } from '../../../src-pwa/manifest.json'

export default defineComponent({
  name: 'App',
  props: {
    dense: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'signup'
    }
  },
  setup(props) {
    const {
      deferredPrompt,
      neverShowAppInstallBanner,
      temporalHideBanner,
      store,
      logoutLoading,
      hideBanners
    } = useAuth()

    function neverShowInstallBanner() {
      store.toggleNeverShowAppInstallBanner(true)
      LocalStorage.set('neverShowAppInstallBanner', true)
    }
    const hideInstallPromotion = () => {
      const type: string = props.type.toLowerCase()
      if (hideBanners.value.menu) {
        hideBanners.value['menu'] = true
      }
      hideBanners.value[type] = true
    }

    async function installApp() {
      if (deferredPrompt.value) {
        deferredPrompt.value.prompt()
        // Esconde la información promotora de la instalación
        // hideInstallPromotion();
        // Muestre el mensaje de instalación
        deferredPrompt.value.prompt()
        // Espera a que el usuario responda al mensaje
        const { outcome } = await deferredPrompt.value.userChoice
        // De manera opcional, envía analíticos del resultado que eligió el usuario
        console.log(`User response to the install prompt: ${outcome}`)
        // Como ya usamos el mensaje, no lo podemos usar de nuevo, este es descartado
        deferredPrompt.value = null
      }
    }

    return {
      hideBanner: computed(
        () =>
          hideBanners.value[props.type.toLowerCase()] ||
          neverShowAppInstallBanner.value ||
          !deferredPrompt.value?.prompt
      ),
      name,
      temporalHideBanner,
      LocalStorage,
      hideInstallPromotion,
      deferredPrompt,
      logoutLoading,
      installApp,
      neverShowInstallBanner,
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
