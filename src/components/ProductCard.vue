<template>
  <q-card
    class="q-mb-lg shadow-12 rounded-borders"
    :class="$q.screen.width < 768 ? 'column' : 'row'"
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
          <div class="col-12">
            <q-separator size="1px" class="q-mx-sm" spaced="5px" />
              <p class="q-pa-md text-caption">{{ product.description }}</p>
                <div class="text-caption row q-px-md">
                  <div v-if="product.accesories" class="col-12">Incluye:</div>
                  <div class="col-auto text-bold">
                    {{ product.accesories }}
                  </div>
                  <div class="col text-warning">
                    {{ product.stock }} en stock
                  </div>
                  <a
                    href="https://www.homelife.it/es/producto/vis"
                    class="text-info cursor-pointer col-auto"
                    :class="$q.screen.width < 768 ? 'q-ml-auto' : 'q-mt-md q-ml-auto'"
                  >
                    Mas información
                  </a>
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


      <q-btn
        @click="addToCart(); bus.emit('product-to-cart', countItemElement)"
        :label="checkIsAdded ? `Añadir ${quantity}+` : 'Añadir'"
        :color="checkIsAdded ? 'secondary' : 'dark'"
        padding="6px"
        no-caps
        class="full-width q-mt-md transition-slow"
        square
        unelevated
      >
            <div
              v-if="Number(itemsAdded) > 0"
              ref="countItemElement"
              class="product-count"
            >
                {{ itemsAdded }}
            </div>
            <div
              :class="!checkIsAdded && 'invisible'"
              ref="countItemElement"
              class="product-count"
            >
                {{ itemsAdded }}
            </div>
      </q-btn>
      <q-btn
        @click="addToCart(); toggleCartDialog()"
        label="Pagar directamente"
        padding="8px"
        no-caps
        class="full-width q-mt-xs text-bold"
        :class="$q.screen.width > 768 && 'q-mb-md'"
        color="warning"
        unelevated
        style="border-top-left-radius: 0; border-top-right-radius: 0;"
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
    background-color: $info !important;
    border-radius: 50px;
    line-height: 24px;
    height: 24px;
    width: 24px;
    top: -6px;
    right: -6px;
    position: absolute;
  }
  .transition-slow {
    transition-property: all;
    transition-duration: 2s;
  }
</style>
