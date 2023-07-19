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
        @click="addProduct(false)"
        :label="checkIsAdded ? 'AÑADIDO' : 'AÑADIR'"
        :color="checkIsAdded ? 'secondary' : 'dark'"
        padding="6px"
        class="full-width q-mt-md"
        square
        unelevated
      >
          <div
            :class="(!checkIsAdded || loading) && 'invisible'"
            ref="countItemElement"
            class="product-count"
          >
              {{ loading ? quantity : itemsAdded }}
          </div>
          <!-- <div
            :class="!checkIsAdded && 'invisible'"
            ref="countItemElement"
            class="product-count"
          >
              {{ loading ? quantity : itemsAdded }}
          </div> -->
      </q-btn>
      <q-btn
        @click="addProduct(true)"
        label="PAGAR DIRECTAMENTE"
        padding="8px"
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
InjectionKey,
} from 'vue';
import { Product } from './models';

import ProductQuantity from 'components/ProductQuantity.vue';
import useCartDialog from '../composables/useCartDialog'
import useProductCart from 'src/composables/useProductCart';
import useCartAnimation from 'src/composables/useCartAnimation';
import { EventBus } from 'quasar';

export default defineComponent({
  name: 'ProductComponent',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  emits: ['product-to-cart'],
  setup(props) {
    const { toggle, loading } = useCartAnimation();
    const { toggleCartDialog } = useCartDialog();
    const { addOrUpdateProduct, cart } = useProductCart();
    const countItemElement: Ref<HTMLDivElement | null> = ref(null);
    const bus = inject<EventBus>('bus', new EventBus());

    const morphGroupModel = ref('topleft')

    const itemsAdded = computed(() => `${cart.value.reduce((acc, crr) => acc += (crr.id === props.product.id ? crr.quantity : 0), 0)}`);
    const quantity = ref(1);

    return {
      checkIsAdded: computed(() => cart.value.some(p => p.id === props.product.id)),
      updateProductQuantity(action: string) {
        if (action === '+') quantity.value += 1
        else quantity.value -= 1
      },
      addProduct(open: boolean): void {
        toggle(true)
        bus.emit('product-to-cart', countItemElement.value)
        if (open) {
          toggleCartDialog();
        }
        addOrUpdateProduct ({ ...<Product>props.product, quantity: quantity.value })

          setTimeout(()=> {
            toggle(false)
            quantity.value = 1;
        }, 1500)
      },
      cart,
      loading,
      morphGroupModel,
      countItemElement,
      itemsAdded,
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
</style>
