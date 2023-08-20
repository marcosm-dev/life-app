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
                <div class="text-body-1 text-deep-purple-1 text-bold">Serpica Life</div>
                <div class="text-caption q-mt-xs q-pr-md" style="line-height: 1.2; font-weight: 500">
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
            glossy
            outline
            rounded
            class="q-mb-md"
          >
            <action-button
              @click="installApp"
              padding="5px 10px"
              class="text-no-wrap no-wrap"
              neutro
              no-caps
              outline
            >
              <template #icon >
                  <q-icon
                    name="mdi-close"
                    @click="hideInstallPromotion"
                    size="20px"
                    class="q-pr-xs"
                    color="blue-grey-14"
                  />
              </template>
              <template #label>
                  Instalar ahora
              </template>
            </action-button>
            <action-button
              padding="5px 10px"
              @click="installApp"
              neutro
              icon="mdi-plus-circle-outline"
              outline
            />
          </q-btn-group>
      </template>
    </transition>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { LocalStorage } from 'quasar';
import useAuth from 'src/composables/useAuth';

enum Types {
  Install,
  Menu,
  SignIn,
  Payment
}

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
      default: Types.Install
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
    } = useAuth();

    function neverShowInstallBanner() {
      store.toggleNeverShowAppInstallBanner(true);
      LocalStorage.set('neverShowAppInstallBanner', true);
    }
    const hideInstallPromotion = () => {
        if (hideBanners.value.menu) {
          return  setTimeout(() => {
              hideBanners.value[Types.Menu] = true;
            }, 4000)
        }
        hideBanners.value[props.type.toLowerCase()] = true;
    };

    async function installApp() {
      if (deferredPrompt.value) {
        deferredPrompt.value.prompt();
        // Esconde la información promotora de la instalación
        // hideInstallPromotion();
        // Muestre el mensaje de instalación
        deferredPrompt.value.prompt();
        // Espera a que el usuario responda al mensaje
        const { outcome } = await deferredPrompt.value.userChoice;
        // De manera opcional, envía analíticos del resultado que eligió el usuario
        console.log(`User response to the install prompt: ${outcome}`);
        // Como ya usamos el mensaje, no lo podemos usar de nuevo, este es descartado
        deferredPrompt.value = null;
      }
    }

    return {
      hideBanner: computed(() => hideBanners.value[props.type.toLowerCase()] || neverShowAppInstallBanner.value || !deferredPrompt.value?.prompt),
      temporalHideBanner,
      LocalStorage,
      hideInstallPromotion,
      deferredPrompt,
      logoutLoading,
      installApp,
      neverShowInstallBanner,
      neverShowAppInstallBanner
    };
  }
});
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

.install-banner-btn .q-btn__content  * {
  color:  $blue-grey-14 !important;
}



</style>
