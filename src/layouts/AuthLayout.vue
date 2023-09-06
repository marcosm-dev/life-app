<template>
  <q-layout view="hHh Lpr fff" class="header-background">
    <q-page-container class="no-padding">
      <router-view  />
    </q-page-container>
    <q-footer class="row text-righ footer-background">
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
          <div class="col-auto knockout text-h5 q-ml-md q-pt-xs text-white">
            SERPICA CANARIAS
            <span class="text-capitalize text-body2 knockout">S.L.</span>
          </div>
          <div
            class="col q-pa-sm q-mr-sm"
            :class="!$q.screen.gt.sm ? 'q-gutter-x-sm' : 'q-gutter-x-xl'"
          >
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
import { defineComponent } from 'vue'
import { useAuthStore } from '../stores/auth'

export default defineComponent({
  name: 'AuthLayout',
  setup() {
    const store = useAuthStore()

    return { store }
  }
})
</script>

<style lang="scss">
.header-background {
  background-image: url('src/assets/backgrounds/registerbackground-min.webp');
  background-size: 100vh;
  background-position: center;
  background-color: $blue-grey-10;
  background-repeat: no-repeat;
}
.footer-background {
  color: $light-blue-1 !important;
  padding: 2rem 0px;
  background: transparent;
  background: linear-gradient(rgb(0, 0, 0, 0.5) 505%, rgb(0, 0, 0, 0.5) 100%);
}

</style>
