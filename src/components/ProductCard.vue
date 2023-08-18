<template>
   <div class="q-px-sm">
      <q-card
        class="q-mb-lg shadow-12 rounded-card"
        :class="$q.screen.width < 768 ? 'column' : 'row'"
        style="max-width: 600px;"
      >
        <q-card-section class="q-py-sm col-12 col-sm-8">
          <div :class="$q.screen.width < 768 ? 'column' : ''">
            <q-img
              class="col"
              style="max-height: 100px"
              :src="`${url}/products/${product.urlImage.toLowerCase()}` ?? '../assets/logo.jpg'"
              fetchpriority="high"
              fit="scale-down"
              crossorigin="anonymous"
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
            <div class="text-bold col full-height flex">
              <div class="text-h5 text-blue-grey-10">
                {{ product.name }}
              </div>
              <a
                target="_blank"
                href="https://www.homelife.it/es/producto/vis"
                class="text-info cursor-pointer col-auto text-caption q-mt-auto q-ml-auto"
                :class="$q.screen.width < 768 ? '' : ''"
              >
                Mas información
              </a>
            </div>
            <div class="col-12">
              <q-separator size="1px" spaced="10px" />
                  <p class="description text-lowercase text-blue-grey-13" style="line-height: 1.2; letter-spacing: 0px;">
                    {{ product.description }}
                  </p>
                  <div class="text-caption row">
                    <div v-if="product.accessories" class="col-12 text-blue-grey-10">Incluye:</div>
                    <div class="col-auto text-lowercase text-blue-grey-13">
                      {{ product.accessories }}
                    </div>
                  </div>
              </div>
          </div>
          </q-card-section>
          <q-separator size="1px" spaced="5px" inset />
          <q-card-actions
            class="col items-end no-padding text-no-wrap full-width"
            :class="$q.screen.width > 768 && 'q-ma-xl'"
          >

            <ProductQuantity
              :product="state"
              @update-item="(e) => e === '+' ? increase() : decrease()"
            >
              <template #extraInfo>
                <p v-if="product.stock < 20" class="text-body2 text-blue-grey-10 q-my-auto knockout full-width">
                    Quedan {{ product.stock }} uds.
                  </p>
              </template>
            </ProductQuantity>

          </q-card-actions>
          <q-card-actions class="row justify-between full-width q-pa-md">
            <action-button
              @click="addToCart(); bus.emit('product-to-cart', countItemElement)"
              :label="$q.screen.width < 300 ? 'Añadir' : 'Al carrito'"
              neutro
              class="transition-slow col"
            >
                <template #icon>
                <q-icon
                  v-if="$q.screen.width > 315"
                  size="20px"
                  name="mdi-cart-arrow-down"
                  color="blue-grey-14"
                  class="q-ml-sm"
                />
                </template>
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
    </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  inject,
  Ref,
} from 'vue';

import ProductQuantity from 'components/ProductQuantity.vue'
import useCartDialog from '../composables/useCartDialog'
import useCartAnimation from 'src/composables/useCartAnimation'
import { EventBus } from 'quasar'
import useProductCart from '../composables/useProductCart'
import { Product } from './models'

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

<style lang="scss" scoped>
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
  .description::first-letter {
    text-transform: uppercase;
  }
</style>
