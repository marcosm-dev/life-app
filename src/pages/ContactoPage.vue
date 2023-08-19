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
            <GoogleMap :api-key="apiKey" style="width: 100%; height: calc(50vh)" :center="center" :zoom="15">
              <MapMarker :options="{ position: center }" />
            </GoogleMap>
        </div>

        <h5 class="mobile-only text-center text-weight-bold q-mb-none">
          Contacto
        </h5>
        <q-separator
          :vertical="$q.screen.width > 768"
          size="30px"
          class="contact-separator"
          spaced="10px"
        />
        <ul
          class="col text-bold text-dark contact"
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

<style lang="scss">
.contact {
  &-separator {
    border-radius: 26px;
    margin-top: 30px !important;
    border: 1px solid rgba($color: #455a64, $alpha: 0.5); /* Agrega un color al borde */
  }
  & * {
    font-family: 'Inter' !important;
  }
}

</style>
