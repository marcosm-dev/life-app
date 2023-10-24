<template>
    <q-card
        class="border-radius-md q-px-sm q-pb-sm bg-grey-1 shadow-5  column justify-end full-height"
        bordered
        outline
      >
        <q-icon
          class="cart-heart"
          size="24px"
          color="blue-grey-13"
          name="mdi-heart-outline"
        />
          <q-card-section class="border-radius-sm col-auto">
              <ImageWithError
                  :image="product.imagen"
                  :brand="product.brand.name"
              />
          </q-card-section>
          <q-card-section class="q-gutter-y-sm col q-pa-sm">
            <div class="text-subtitle3 full-width q-pa-sm border-radius-sm text-grey-10 bg-lime-14">
                {{ product.name }}
            </div>
            <div class="text-caption border-radius-sm text-blue-grey-10">
                {{ product.description.toLowerCase() }}.
            </div>
            <div
              v-if="product.price && product.uuid || product.stock"
              class="bg-lime-13 text-grey-10 text-bold q-pa-sm border-radius-sm col-12 flex items-end"
            >
                <div class="q-ml-auto flex text-right">
                    {{ product.price.toFixed(2).replace('.', ',') }}
                  <small class="block q-mr-auto q-mx-sm text-caption">
                    EUR
                  </small>
                </div>
            </div>
            <div v-if="product.stock < 10 && product.stock !== 0" class="text-bold text-accent text-overline q-pt-xs text-right">
                {{ $t('product.stockMessage', { stock: product.stock}, product.stock) }}
            </div>
        </q-card-section>
        <q-card-actions class="flex justify-end items-end col-auto q-gutter-y-md">
            <action-button
              v-if="!product.stock && product.uuid"
              @click="toggleCustomDialog"
              class="text-no-wrap q-pa-sm col-12 text-bold"
              padding="5px 10px"
              size="11px"
              :label="$t('product.noStockMessage')"
            />
            <order-button v-else-if="!product.uuid && !product.stock" :product="product" dense />
            <div class="full-width">
              <action-button
                @click="$router.push(`/product/${product.id}`)"
                class="text-no-wrap full-width"
                neutro
                padding="5px 20px"
                :label="$t('product.view')"
              />
            </div>
        </q-card-actions>
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useCustomDialog from 'src/composables/useCustomDialog'

import { Product } from './models'
import OrderButton from 'components/OrderButton.vue'
export default defineComponent({
  name: 'ProductCategory',
  props: {
    product: {
      type: Object as () => Product,
      default: () => ({})
    },
  },
  components: { OrderButton },
  setup(props) {
    const { toggleCustomDialog } = useCustomDialog('stock', props.product)

    return {
      toggleCustomDialog,
    }
  }
})
</script>
