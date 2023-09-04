<template>
    <q-card
      class="q-mb-lg shadow-12 rounded-card row items-end"
      style="max-width: 600px"
    >
      <q-card-section class="col-12">
          <q-img
            class="col q-mb-md"
            style="border-radius: 26px"
            src="https://res.cloudinary.com/doabho3qp/image/upload/v1693770830/fotos%20armiche/maxiVerde_2_.png_vqdsaq.png"
            fetchpriority="high"
            fit="scale-down"
            height="150px"
            crossorigin="anonymous"
          >
            <template #error>
              <q-img
                class="col"
                style="border-radius: 26px; border: 1px solid rgba(#455a64, 10)"
                src="../assets/logo.jpg"
                width="170px"
                height="100px"
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
          <q-separator size="1px" spaced="10px" />
          <div class="col-12">
            <div class="row q-col-gutter-y-md">
                  <div class="description text-lowercase text-blue-grey-13 col-12">
                    {{ product.description }}
                  </div>
                  <div v-if="product.accessories" class="col-12 text-blue-grey-10 text-bold">
                    Incluye:
                  </div>
                  <div class="col-auto text-lowercase text-blue-grey-13">
                    {{ product.accessories }}
                  </div>
                </div>
            </div>
        <q-separator size="1px" spaced="5px" />
      </q-card-section>
      <q-card-actions class="col-12 items-end no-padding text-no-wrap">
        <ProductQuantity
          :product="state"
          @update-item="(e) => (e === '+' ? increase() : decrease())"
        >
          <template #extraInfo>
            <div
              v-if="product.stock < 20"
              class="text-accent q-my-auto  col text-right text-accent"
            >
              {{  product.stock === 1 ?  `Queda ${product.stock} ud.` :  `Quedan ${product.stock} uds.`}}
            </div>
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
              name="mdi-cart-plus"
              color="blue-grey-14"
              class="q-ml-sm"
            />
          </template>
          <template #badge>
            <div
              v-if="Number(itemsAdded) > 0"
              ref="countItemElement"
              :key="itemsAdded"
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
          style="min-width: 130.8px"
        />
      </q-card-actions>
    </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject, Ref } from 'vue'

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
    }
  },
  emits: ['product-to-cart'],
  setup(props) {
    const { cart, increase, decrease, state, addToCart } = useProductCart(props.product)
    const { toggle, loading } = useCartAnimation()
    const { toggleCartDialog } = useCartDialog()
    const countItemElement: Ref<HTMLDivElement | null> = ref(null)
    const bus = inject<EventBus>('bus', new EventBus())

    const morphGroupModel = ref('topleft')

    return {
      bus,
      increase,
      decrease,
      addToCart,
      state,
      useProductCart,
      toggle,
      itemsAdded: computed(
        () =>
          `${cart.value.reduce(
            (acc, crr) =>
              (acc += crr.id === props.product.id ? crr.quantity : 0),
            0
          )}`
      ),
      checkIsAdded: computed(() =>
        cart.value.some((p: Product) => p.id === props.product.id)
      ),
      url: process.env.IMAGES_URL,
      loading,
      morphGroupModel,
      countItemElement,
      toggleCartDialog,
    }
  },
  components: {
    ProductQuantity
  }
})
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
