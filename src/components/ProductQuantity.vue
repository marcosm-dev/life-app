<template>

  <!-- ADAPTACIÓN PARA CARRITO -->
  <div
    v-if="dense"
    class="row items-center jusify-between text-center full-width dense-cart-dialog"
  >
    <div
      :class="$q.screen.width < 768 ? 'q-mb-sm' : 'q-mb-lg'"
      class="col-12 text-center text-h5"
    >
      {{ quantity }}
    </div>
    <q-btn
      @click="$emit('update-product', '-')"
      class="col col-sm-5 col-md-5"
      :color="quantity === 0 ? 'negative' : 'dark-page'"
      :text-color="quantity === 0 ? '' : 'dark'"
      square
      :outline="quantity === 0"
      :icon="quantity === 0 ? 'mdi-delete-outline' : 'mdi-minus'"
      unelevated
    />

    <q-btn
      @click="$emit('update-product', '+')"
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
      {{ price * quantity }} €
    </div>
    <q-btn
      @click="quantity !== 1 ? $emit('update-product', '-') : null"
      class="col col-sm-3 col-md-4 text-black"
      color="dark-page"
      square
      icon="mdi-minus"
      unelevated
    />
    <div class="col items-center q-py-lg text-subtitle1">
      {{ quantity }}
    </div>
    <q-btn
      @click="$emit('update-product', '+')"
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

export default defineComponent({
  name: 'ProductQuantity',
  props: ['quantity', 'price', 'dense'],
  emits: ['update-product'],
});
</script>

<style lang="scss">
.dense-cart-dialog {
  max-width: 120px;
}
</style>
