<template>
  <!-- ADAPTACIÓN PARA CARRITO -->
  <q-card-section v-if="dense" class="row">
    <q-btn
      class="col-4"
      aria-label="minus"
      @click="$emit('update-item', '-')"
      color="blue-grey-4"
      outline
      icon="mdi-minus"
      unelevated
      rounded
      size="10px"
      ripple
    />
    <div
      :class="$q.screen.width < 768 ? 'q-mb-sm' : 'q-mb-lg'"
      class="text-center text-black col q-my-auto knockout"
    >
      {{ product.quantity }}
    </div>
    <q-btn
      class="col-4"
      aria-label="plus"
      @click="$emit('update-item', '+')"
      unelevated
      color="blue-grey-4"
      outline
      size="10px"
      icon="mdi-plus"
      ripple
      rounded
    />
  </q-card-section>

  <!--  COMPONENTE COMÚN -->

  <q-card-section
    v-else
    class="row q-py-none items-center text-center full-width"
  >
    <div
      :class="$q.screen.width < 768 ? 'q-mt-lg' : 'q-mb-lg'"
      class="col-12 items-center flex"
    >

      <div class="knockout text-h6 text-blue-grey-14  col-auto">
        {{ product.price.toFixed(2) }}
        <small class="text-blue-grey-13">€</small>
      </div>
      <slot  name="extraInfo" />
    </div>
    <q-btn
      @click="$emit('update-item', '-')"
      class="col col-sm-3 col-md-4 text-black"
      color="blue-grey-4"
      size="10px"
      rounded
      outline
      icon="mdi-minus"
      unelevated
    />
    <div class="col items-center q-py-lg text-subtitle1 knockout">
      {{ product.quantity }}
    </div>
    <q-btn
      @click="$emit('update-item', '+')"
      unelevated
      rounded
      outline
      size="10px"
      class="col col-sm-3 col-md-4 text-black"
      color="blue-grey-4"
      icon="mdi-plus"
    />
  </q-card-section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Product } from './models'

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
  emits: ['update-item']
})
</script>

<style lang="scss">
.dense-cart-dialog {
  max-width: 120px;
}
</style>
