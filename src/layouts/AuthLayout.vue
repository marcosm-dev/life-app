<template>
  <q-layout
    view="hHh Lpr fff"
    class="auth-background"
  >
    <q-page-container>
      <router-view />
    </q-page-container>
      <div class="row justify-center text-center">
        <!-- <a
          href="https://www.serpica.org"
          class="text-warning knockout text-h4 fixed full-width serpica"
        >
          SERPICA
      </a> -->
      </div>
      <q-footer class="row text-right fixed-bottom footer-background">
        <aside class="col-12">
          <div class="row items-center">
            <q-separator class="col" size="6px" color="light-blue-1" />
            <div class="col-auto q-px-sm text-body2 knockout text-white">
              INFORMACIÓN Y CONTACTO
            </div>
            <q-separator
              class="col-auto"
              size="6px"
              color="light-blue-1"
              :style="!$q.screen.gt.sm ? 'width: 5px;' : 'width: 230px;'"
            />
            </div>
            <div id="social-network" class="row justify-around">
              <div class="col-auto knockout text-h5 q-ml-md q-pt-xs text-white">SERPICA CANARIAS
              <span class="text-capitalize text-body2 knockout">S.L.</span></div>
              <div class="col q-pa-sm q-mr-sm" :class="!$q.screen.gt.sm ? 'q-gutter-x-sm' : 'q-gutter-x-xl'">
                <a target="_blank" href="https://www.instagram.com/serpica.sa">
                <q-icon size="28px" name="mdi-instagram" />
                </a>
                <a target="_blank" href="https://www.homelife.it/es/download">
                  <q-icon size="28px" name="mdi-web" />
                </a>
                <q-icon
                  tag="a"
                  href="https://api.whatsapp.com/send?phone=657422136"
                  size="35px"
                  color="light-green-13"
                  name="mdi-whatsapp"
                />
              </div>
          </div>
          </aside>
      </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { BeforeInstallPromptEvent } from '../components/models';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const store = useAuthStore()
    const { setDeferredPrompt } = useAuthStore()
      const beforeInstallHandler = (e: Event) => {

      // Verificar si el evento es realmente un BeforeInstallPromptEvent
      if ((e as BeforeInstallPromptEvent).platforms) {
        const beforeInstallPromptEvent = e as BeforeInstallPromptEvent
        console.log(beforeInstallPromptEvent)
        // Por ejemplo, si quisieras mostrar la solicitud de instalación manualmente:
        setDeferredPrompt(beforeInstallPromptEvent)
      }
    }

    onMounted(() => {
      window.addEventListener('beforeinstallprompt', beforeInstallHandler)
    })

    return { store }
  }
});
</script>

<style lang="scss" scoped>
  .auth-background {
    background-image: url('./src/assets/backgrounds/registerbackground-min.webp');
    background-size: contain;
  }
  .footer-background {
    color: $light-blue-1 !important;
    padding: 78px 0px;
    background: transparent;
    background-position-y: 100px;
    background: linear-gradient( rgb(0,0,0,0.5) 505%,  rgb(0,0,0,0.5) 100%);
  }

  .serpica {
    margin: 0 auto;
    bottom: 15%;
    display: block !important;
  }
</style>
