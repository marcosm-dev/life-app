<template>
  <q-card
    class="q-mb-lg shadow-12 rounded-borders"
    :class="$q.screen.width < 768 ? 'column' : 'row'"
    style="max-width: 600px;"
  >
    <q-card-section class="q-py-sm col-12 col-sm-8">
       <div :class="$q.screen.width < 768 ? 'column' : 'row items-end'">
         <q-img
          class="col"
          style="max-height: 175px"
          :src="`${url}/products/${product.urlImage.toLowerCase()}` ?? '../assets/logo.jpg'"
          fetchpriority="high"
          fit="scale-down"
          crossorigin="anonymous"
          :ratio="1"
        >
          <template #error>
              <q-img
                class="col"
                src="../assets/logo.jpg"
                width="170px"
                height="70px"
              />
          </template>
        </q-img>
        <span class="text-bold text-h6 q-mx-sm col">
          {{ product.name }}
        </span>
          <a
            href="https://www.homelife.it/es/producto/vis"
            class="text-info cursor-pointer col-auto"
            :class="$q.screen.width < 768 ? 'q-ml-auto' : 'q-mt-md q-ml-auto'"
          >
            Mas información
          </a>
          <div class="col-12">
            <q-separator size="1px" spaced="5px" />
              <p class="text-caption">{{ product.description }}</p>
                <div class="text-caption row">
                  <div v-if="product.accessories" class="col-12">Incluye:</div>
                  <div class="col-auto text-bold">
                    {{ product.accessories }}
                  </div>
                  <div class="col text-right text-warning">
                    {{ product.stock }} en stock
                  </div>
                </div>
            </div>
          </div>
        </q-card-section>
        <q-separator size="1px" inset />
        <q-card-actions
          class="col items-end no-padding full-width"
          :class="$q.screen.width > 768 && 'q-ma-xl'"
        >

          <ProductQuantity
            :product="state"
            @update-item="(e) => e === '+' ? increase() : decrease()"
          />

        </q-card-actions>
        <q-card-actions class="row justify-between full-width q-pa-md">
          <action-button
            @click="addToCart(); bus.emit('product-to-cart', countItemElement)"
            label="Al carrito"
            neutro
            class="transition-slow col"
            icon="mdi-cart-outline"
          >
              <template #badge>
                <div
                  v-if="Number(itemsAdded) > 0"
                  :key="itemsAdded"
                  ref="countItemElement"
                  class="product-count"
                >
                    {{ itemsAdded }}
                </div>
              </template>
          </action-button>
          <action-button
            @click="addToCart(); toggleCartDialog()"
            class="transition-slow col"
            label="Pagar"
            style="min-width: 130.8px;"
          />
        </q-card-actions>
    </q-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  inject,
  Ref,
} from 'vue';

import ProductQuantity from 'components/ProductQuantity.vue';
import useCartDialog from '../composables/useCartDialog'
import useCartAnimation from 'src/composables/useCartAnimation';
import { EventBus } from 'quasar';
import useProductCart from '../composables/useProductCart';
import { Product } from './models';

export default defineComponent({
  name: 'ProductComponent',
  props: {
    product: {
      type: Object as () => Product,
      default: () => ({ id: 0, name: '', price: 0, quantity: 0 })
    },
  },
  emits: ['product-to-cart'],
  setup(props) {
    const {
      cart,
      quantity,
      increase,
      decrease,
      state,
      addToCart
    } = useProductCart(props.product);
    const { toggle, loading } = useCartAnimation();
    const { toggleCartDialog } = useCartDialog();
    const countItemElement: Ref<HTMLDivElement | null> = ref(null);
    const bus = inject<EventBus>('bus', new EventBus());

    const morphGroupModel = ref('topleft')


    return {
      bus,
      increase,
      decrease,
      addToCart,
      state,
      useProductCart,
      toggle,
      itemsAdded: computed(() => `${cart.value.reduce((acc, crr) => acc += (crr.id === props.product.id ? crr.quantity : 0), 0)}`),
      checkIsAdded: computed(() => cart.value.some((p: Product) => p.id === props.product.id)),
      url: process.env.IMAGES_URL,
      loading,
      morphGroupModel,
      countItemElement,
      toggleCartDialog,
      quantity,
    };
  },
  components: {
    ProductQuantity
  }
});
</script>

<style lang="scss">
  .product-count {
    background-color: $light-blue-11 !important;
    color: #fff;
    font-size: 14px;
    font-family: 'Knockout';
    border-radius: 28px;
    line-height: 30px;
    height: 30px;
    width: 30px;
    top: -6px;
    right: -6px;
    position: absolute !important;
  }
  .transition-slow {
    transition-property: all;
    transition-duration: 2s;
  }
  .mdi-cart-outline {
    margin-right: 10px;
  }

</style>
