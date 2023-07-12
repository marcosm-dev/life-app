<template>
  <q-card class="column q-mb-md">
    <q-card-section class="q-pa-sm col">
      <q-img class="col" src="../assets/logo.jpg" width="160px" height="70px" />
      <span class="text-bold text-h6 q-mx-sm">
        {{ product.name }}
      </span>
      <q-separator size="1px" class="q-mx-sm" spaced="5px" />
      <p class="q-py-md text-caption">{{ product.description }}</p>
      <div class="text-caption row">
        <div class="col-12">Incluye:</div>
        <p class="text-bold">
          {{ product.accesories }}
        </p>
        <a
          href="https://www.homelife.it/es/producto/vis"
          class="text-warning q-ml-auto cursor-pointer"
        >
          Mas información
        </a>
      </div>
    </q-card-section>
    <q-separator size="1px" class="q-mx-sm" />
    <q-card-actions class="col items-end no-padding">
      <div class="row items-center text-center full-width">
        <div class="col-12 q-pt-md text-h5">
          {{ product.price * quantity }} €
        </div>
        <q-btn
          @click="quantity ? (quantity -= 1) : null"
          class="col text-black"
          color="dark-page"
          square
          icon="mdi-minus"
          unelevated
        />
        <div class="col items-center q-py-lg text-subtitle1">
          {{ quantity }}
        </div>
        <q-btn
          @click="quantity += 1"
          unelevated
          class="col text-black"
          color="dark-page"
          square
          icon="mdi-plus"
        />
      </div>

      <q-btn
        @click="addProduct"
        label="AÑADIR"
        color="dark"
        class="full-width q-mt-md"
        square
        unelevated
      />
      <q-btn
        label="PAGAR DIRECTAMENTE"
        class="full-width q-mt-xs text-bold"
        color="warning"
        unelevated
        square
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { Product } from './models';


export default defineComponent({
  name: 'ProductComponent',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useCartStore();
    const quantity = ref(1);
    return {
      addProduct(){
        store.addOrUpdateProduct({...<Product>props.product, quantity: quantity.value})
      },
      quantity,
      store,
    };
  },
});
</script>
