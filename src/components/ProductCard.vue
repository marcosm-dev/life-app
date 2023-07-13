<template>
  <q-card
    class="q-mb-lg shadow-12 rounded-borders"
    :class="$q.screen.width < 768 ? 'column' : 'row'"
  >
    <q-card-section class="q-py-sm col-12 col-sm-8">
        <q-img
          class="col"
          style="max-height: 175px"
          :src="product.urlImage"
          fetchpriority="high"
          fit="scale-down"
        >
          <template v-slot:error>
              <q-img
                class="col"
                src="../assets/logo.jpg"
                width="170px"
                height="70px"
              />
          </template>
        </q-img>
      <span class="text-bold text-h6 q-mx-sm">
        {{ product.name }}
      </span>
      <q-separator size="1px" class="q-mx-sm" spaced="5px" />
      <p class="q-pa-md text-caption">{{ product.description }}</p>
      <div class="text-caption row q-px-md">
        <div v-if="product.accesories" class="col-12">Incluye:</div>
        <div class="col-auto text-bold">
          {{ product.accesories }}
        </div>
        <a
          href="https://www.homelife.it/es/producto/vis"
          class="text-warning cursor-pointer"
          :class="$q.screen.width < 768 ? 'q-ml-auto' : 'q-mt-md q-ml-auto'"
        >
          Mas información
        </a>
      </div>
    </q-card-section>
    <q-separator size="1px" inset />
    <q-card-actions
      class="col items-end no-padding full-width"
      :class="$q.screen.width > 768 && 'q-ma-xl'"
    >

      <ProductQuantity
        @update-product="updateProductQuantity"
        :quantity="quantity"
        :price="product.price"
      />

      <q-btn
        @click="addProduct"
        label="AÑADIR"
        color="dark"
        padding="6px"
        class="full-width q-mt-md"
        square
        unelevated
      />
      <q-btn
        @click="toggleCartDialog"
        label="PAGAR DIRECTAMENTE"
        padding="8px"
        class="full-width q-mt-xs text-bold"
        color="warning"
        unelevated
        style="border-top-left-radius: 0; border-top-right-radius: 0;"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Product } from './models';

import ProductQuantity from 'components/ProductQuantity.vue';
import useCartDialog from '../composables/useCartDialog'
import useProductCart from 'src/composables/useProductCart';


export default defineComponent({
  name: 'ProductComponent',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { toggleCartDialog } = useCartDialog();
    const { addOrUpdateProduct } = useProductCart();

    const quantity = ref(1);
    return {
      updateProductQuantity(action: string) {
        if (action === '+') quantity.value += 1
        else quantity.value -= 1
      },
      addProduct(){
        toggleCartDialog();
        addOrUpdateProduct ({ ...<Product>props.product, quantity: quantity.value })
          quantity.value = 1;
      },
      toggleCartDialog,
      quantity,
    };
  },
  components: {
    ProductQuantity
  }
});
</script>
