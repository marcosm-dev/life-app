<script lang="ts" setup>
import { capitalizeFirstLetter } from '../../utils/utilities'
const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  },
})
const { product } = props;
const url = process.env.IMAGES_URL
const urlImage = `${url}/productos/${product.imagen}`
</script>

<template>
  <q-card class="my-card " flat bordered>
     <q-card-section>
        <q-item>
          <q-item-section avatar>
            <q-avatar square>
              <img :src="urlImage">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ product.name }}</q-item-label>
            <q-item-label caption>
              {{ capitalizeFirstLetter(product.accessories.toLowerCase()) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-separator />

      <q-card-section horizontal>
        <q-card-section>
          <q-item>
            <q-item-section>
              <q-item-label class="text-no-wrap">
                {{ product.price.toFixed(2).replace('.', ',') }} €
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-separator vertical />

        <q-card-section class="q-pa-sm">
          <q-item>
            <q-item-section>
              <q-item-label>
                {{ capitalizeFirstLetter(product.description.toLowerCase()) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card-section>
    </q-card>
</template>
