<template>

  <!-- ADAPTACIÓN PARA CARRITO -->
  <div
    v-if="dense"
    class="row items-center jusify-between text-center full-width dense-cart-dialog"
  >
    <div
      :class="$q.screen.width < 768 ? 'q-mb-sm' : 'q-mb-lg'"
      class="col-12 text-center text-h5 card-item"
    >
      {{ product.quantity }}
    </div>
    <q-btn
      aria-label="minus"
      @click="$emit('update-item', '-')"
      class="col col-sm-5 col-md-5"
      :color="product.quantity === 0 ? 'negative' : 'dark-page'"
      :text-color="product.quantity === 0 ? '' : 'dark'"
      square
      :outline="product.quantity === 0"
      :icon="product.quantity === 0 ? 'mdi-delete-outline' : 'mdi-minus'"
      unelevated
    />

    <q-btn
      aria-label="plus"
      @click="$emit('update-item', '+')"
      unelevated
      class="col col-sm-2 col-md-5 offset-2 text-black"
      color="dark-page"
      square
      icon="mdi-plus"
    />
  </div>

  <!--  COMPONENTE COMÚN -->

  <div v-else class="row items-center text-center full-width">
    <div
      :class="$q.screen.width < 768 ? 'q-mt-lg' : 'q-mb-lg'"
      class="col-12 text-center text-h5"
    >
      {{ product.price * (product.quantity ?? 1) }} €
    </div>
    <q-btn
      @click="$emit('update-item', '-')"
      class="col col-sm-3 col-md-4 text-black"
      color="dark-page"
      square
      icon="mdi-minus"
      unelevated
    />
    <div class="col items-center q-py-lg text-subtitle1">
      {{ product.quantity }}
    </div>
    <q-btn
      @click="$emit('update-item', '+')"
      unelevated
      class="col col-sm-3 col-md-4 text-black"
      color="dark-page"
      square
      icon="mdi-plus"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Product } from './models';

export default defineComponent({
  name: 'ProductQuantity',
  props: {
    product: {
      type: Object as () => Product,
       default: () => ({})
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update-item'],
});
</script>

<style lang="scss">
.dense-cart-dialog {
  max-width: 120px;
}
</style>
