<template>
  <q-layout view="hHh Lpr fff">
   <q-header>
      <q-img
        v-if="store.register"
        class="absolute-top"
        height="100vh"
        src="~assets/backgrounds/registerbackground-min.webp"
        fetchpriority="high"
        alt="imagen de registro, puerta, motor y coche de coche"
        loading="lazy"
      />
   </q-header>
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
      <q-footer class="row text-right bg-white">
        <aside class="col-12 text-black">
          <div class="row items-center">
            <q-separator class="col" size="2px" />
            <div class="col-auto q-px-sm text-body2 knockout text-blue-grey-13">
              INFORMACIÓN Y CONTACTO
            </div>
            <q-separator class="col-auto" style="width: 110px;" size="2px" />
            </div>
            <div id="social-network" class="row justify-around">
              <div class="col-auto knockout text-h6 text-blue-grey-10 q-ml-md q-pt-xs">SERPICA CANARIAS
              <span class="text-capitalize text-body2 knockout">S.L.</span></div>
              <div class="col q-gutter-x-sm q-pa-sm">
                <a href="https://www.instagram.com/serpica.sa">
                <q-icon size="25px" name="mdi-instagram" color="dark" />
                </a>
                <a href="https://www.homelife.it/es/download">
                  <q-icon size="25px" name="mdi-web" color="dark" />
                </a>
                <q-icon
                  tag="a"
                  href="https://api.whatsapp.com/send?phone=657422136"
                  size="26px"
                  name="mdi-whatsapp"
                  color="secondary cursor-pointer"
                />
              </div>
          </div>
          <!-- <q-card-section v-show="errors.length" class="text-negative">
            <q-list dense bordered padding class="rounded-borders">
              <q-item v-for="error in errors" clickable v-ripple :key="error">
                <q-item-section>
                  {{ error }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section> -->
          </aside>
          <div class="col flag-green" />
          <div class="col flag-white text-dark text-center text-bold text-dark">
            <p>MADE IN ITALY</p>
          </div>
          <div class="col flag-red" />
      </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const store = useAuthStore();

    return { store }
  }
});
</script>

<style lang="scss">
  .serpica {
    margin: 0 auto;
    bottom: 15%;
    display: block !important;
  }
</style>
