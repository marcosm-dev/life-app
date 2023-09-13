<template>
  <q-layout view="hHh Lpr fff" class="header-background">
    <q-page-container>
      <router-view  />
    </q-page-container>
    <q-footer class="row text-righ footer-background">
      <aside class="col-12">
        <div class="row items-center">
          <q-separator class="col" size="6px" color="grey-1" />
          <div class="col-auto q-px-sm text-subtitle2 text-blue-grey-1">
            INFORMACIÓN Y CONTACTO
          </div>
          <q-separator
            class="col-auto"
            size="6px"
            color="grey-1"
            :style="!$q.screen.gt.sm ? 'width: 5px;' : 'width: 230px;'"
          />
        </div>
        <div id="social-network" class="row justify-between">
          <div class="col-auto text-h5 q-ml-md q-pt-xs text-lime-13">
            SERPICA CANARIAS
            <span class="text-capitalize text-body2">S.L.</span>
          </div>
          <div
            class="col-auto q-mr-md q-gutter-x-md"
            :class="!$q.screen.gt.sm ? 'q-gutter-x-sm' : 'q-gutter-x-xl'"
          >
            <a target="_blank" href="https://www.instagram.com/serpica.sa">
              <q-icon size="25px" name="mdi-instagram" color="grey-1" />
            </a>
            <a target="_blank" href="https://www.homelife.it/es/download">
              <q-icon size="25px" name="mdi-web" color="grey-1" />
            </a>
            <q-icon
              tag="a"
              href="https://api.whatsapp.com/send?phone=657422136"
              size="30px"
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
  padding: 2.2rem 0px;
  background: transparent;
  background: linear-gradient(rgb(0, 0, 0, 0.5) 505%, rgb(0, 0, 0, 0.5) 100%);
}

</style>
