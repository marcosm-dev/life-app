<template>
  <q-page padding>
    <div
      class="justify-center"
      :class="$q.screen.width > 768 ? 'row items-center' : 'column'"
    >
      <div
        class="col offset-2 col-lg-5"
        :class="$q.screen.width < 768 && 'full-width offset-1'"
      >
        <GoogleMap
          :api-key="apiKey"
          style="width: 100%; height: calc(50vh)"
          :center="center"
          :zoom="15"
        >
          <MapMarker :options="{ position: center }" />
        </GoogleMap>
      </div>

      <h5 class="mobile-only text-center text-weight-medium q-mb-none">
         {{  $t('menu.contact') }}
      </h5>
      <q-separator
        :vertical="$q.screen.width > 768"
        size="30px"
        class="contact-separator"
        spaced="10px"
      />
      <ul
        class="col text-bold text-dark contact"
        style="list-style: none; line-height: 2"
      >
        <li class="text-subtitle2">{{ address }}</li>
        <li>{{ postalCode }} {{ location }}</li>
        <li class="text-weight-medium">{{ province }}</li>
        <li>
          <q-icon class="q-mr-xs" name="mdi-email-outline" size="20px" />
          <a href="mailto:serpica.sa@hotmail.com" class="text-subtitle2 q-mr-xs">
            {{ email }}
          </a>
        </li>
        <li>
          <a href="tel:+34657422132" class="text-subtitle2">
            <q-icon name="mdi-phone-outline" size="20px" />
            +{{phone}}
          </a>
        </li>
      </ul>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { GoogleMap, Marker as MapMarker } from 'vue3-google-map'
import * as config from '../../user.config'
const {
  phone,
  email,
  province,
  address,
  postalCode,
  location
} = config.default

const center = { lat: 28.080605855696696, lng: -15.461903973725459 }
const apiKey = process.env.GOOGLE_MAPS_API_KEY


</script>

<style lang="scss">
.contact {
  &-separator {
    border-radius: 26px;
    margin-top: 30px !important;
    background: transparent;
    border: 1px solid rgba($color: #455a64, $alpha: 0.5); /* Agrega un color al borde */
  }
  & * {
    font-family: 'Inter' !important;
  }
}
</style>
