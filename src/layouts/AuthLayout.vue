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
      <q-img
        v-else
        class="absolute-top"
        src="~assets/backgrounds/loginbackground-min.webp"
        fetchpriority="high"
        alt="serpica life logo"
        loading="lazy"
      />
   </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
      <div class="row justify-center text-center">
        <a
          href="https://www.serpica.org"
          class="text-warning knockout text-h4 fixed full-width serpica"
        >
          SERPICA
      </a>
      </div>
      <q-footer class="row bg-white" :style="$q.screen.width <= 768 ? 'height: 10px' : 'height: 20px'">
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
