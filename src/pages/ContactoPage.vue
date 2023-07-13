<template>
  <q-page padding>
    <div
      class="justify-center"
      :class="$q.screen.width > 768 ? 'row items-center'  : 'column'"
    >
        <div
          class="col offset-2 col-lg-5"
          :class="$q.screen.width < 768 && 'full-width offset-1'"
        >
            <GoogleMap :api-key="apiKey" style="width: 100%; height: 400px" :center="center" :zoom="15">
              <MapMarker :options="{ position: center }" />
            </GoogleMap>
        </div>

        <h5 class="text-center text-weight-bold q-mb-none">
          Contacto
        </h5>
        <q-separator :vertical="$q.screen.width > 768" color="dark" size="30px" spaced="10px"/>
        <ul
          class="col text-bold text-subtitle text-dark"
          style="list-style: none; line-height: 2;"
        >
            <li class="text-subtitle2">C/ Ctra Almatriche alto, 198</li>
            <li>35018 Las Palmas - Tamaraceite</li>
            <li>
              Las Palmas de Gran Canaria
            </li>
            <li>
              <q-icon name="mdi-email" size="20px" />
              <a href="mailto:serpica.sa@hotmail.com" class="text-subtitle2">
                serpica.sa@hotmail.com
              </a>
            </li>
            <li>
              <a href="tel:+34657422132" class="text-subtitle2">
                <q-icon name="mdi-phone" size="20px" />
                +34657422132
              </a>
            </li>
        </ul>
    </div>




  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GoogleMap, Marker as MapMarker } from 'vue3-google-map';

export default defineComponent({
  name: 'ContactoPage',
  setup() {
    const center = { lat: 28.080605855696696, lng: -15.461903973725459 };

    return {
      center,
      apiKey: process.env.GOOGLE_MAPS_API_KEY
    };
  },
  components: { GoogleMap, MapMarker },
});
</script>
