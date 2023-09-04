<template>
  <transition leave-active-class="animated fadeOut">
    <template v-if="!hideBanner">
      <q-banner
        key="banner-classic"
        v-if="['Payment', 'SignUp'].includes(type)"
        class="animated fadeIn rounded-banner-bottom bg-deep-purple-12 q-py-md full-width"
        style="animation-delay: 0.2s"
        dense
      >
        <div class="row">
          <q-btn
            flat
            color="positive"
            icon="mdi-close"
            class="q-pl-none q-pr-xs"
            size="18px"
            v-close-popup
          />
          <div class="col q-gutter-y-sm text-white">
            <div class="text-body-1 text-deep-purple-1 text-bold">
              Serpica Life
            </div>
            <div
              class="text-caption q-mt-xs q-pr-md"
              style="line-height: 1.2; font-weight: 500"
            >
              Instalar nuestra app es gratis y en un solo clic.
            </div>
          </div>
          <q-btn
            @click="installApp"
            class="col-auto q-my-auto q-px-sm q-py-sm bg-deep-purple-1 install-banner-btn"
            style="animation-delay: , 2s"
            no-caps
            rounded
            color="white"
            padding="15px 30px"
            outline
            label="Instalar ahora"
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
            <label class="q-ml-auto">Instalar</label>
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
          padding="4.5px 24px"
          class="q-mt-auto q-ml q-mr-sm q-mb-lg text-bold bg-lime-13"
          color="dark"
          text-color="blue-grey-8"
          dense
          square
          flat
          @click="installApp"
          label="Instalar"
          no-caps
      />
    </template>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { LocalStorage } from 'quasar'
import useAuth from 'src/composables/useAuth'

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

.install-banner-btn .q-btn__content * {
  color: $blue-grey-14 !important;
}
</style>
