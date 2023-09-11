<template>
    <q-card
        class="border-radius-md q-px-sm q-pb-sm bg-grey-1 shadow-5  column justify-end"
        bordered
        outline
      >
        <q-icon
          class="cart-heart"
          size="24px"
          color="blue-grey-13"
          name="mdi-heart-outline"
        />
          <q-card-section class="border-radius-sm col-3">
              <q-img
                :src="`${url}/productos/${product.imagen}`"
                height="90px"
                fit="scale-down"
              >
                  <template #error>
                    <q-img
                        src="../assets/logo.jpg"
                      fit="scale-down"
                      height="90px"
                      class="bg-transparent border-radius-md"
                    />
                  </template>
                </q-img>
          </q-card-section>
          <q-card-section class="q-gutter-y-sm  col-5 q-pa-sm">
            <div class="text-subtitle1 full-width q-pa-sm  border-radius-sm text-grey-10 bg-lime-14">
                {{ product.name }}
            </div>
            <div class="text-caption border-radius-sm text-blue-grey-10">
                {{ product.description.toLowerCase() }}.
            </div>
        </q-card-section>

        <q-card-actions class="flex justify-end items-end col-3">
              <div v-if="product.price && product.uuid" class="bg-lime-13 text-grey-10 text-bold q-pa-sm border-radius-sm col-12 flex items-end">
                  <div class="q-ml-auto flex text-right">
                      {{ product.price.toFixed(2).replace('.', ',') }}
                    <small class="block q-mr-auto q-mx-sm text-caption">EUR</small>
                  </div>
              </div>
                <action-button
                    v-else-if="!product.stock && product.uuid"
                  @click="toggleCustomDialog"
                    class="text-no-wrap q-pa-sm col-12 text-bold"
                    padding="5px 10px"
                    size="11px"
                    label="Avísame cuando llegue"
                  />
                <order-button v-else-if="!product.uuid && !product.stock" :product="product"  dense />
              <div v-if="product.stock < 10 && product.stock !== 0" class="text-bold text-accent text-overline q-pt-xs">
                  Quedan {{ product.stock }} {{ product.stock > 1 ? 'Uds' : 'Ud' }}.
              </div>
            <div class="full-width q-pt-md">
                  <action-button
                    :to="`/product/${product.id}`"
                    class="text-no-wrap full-width"
                    neutro
                    padding="5px 20px"
                    label="Ver producto"
                  />
            </div>
        </q-card-actions>
    </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useCustomDialog from 'src/composables/useCustomDialog'
import { Product } from './models'
import useAuth from 'src/composables/useAuth'
import { format } from 'quasar'
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
    const { user } = useAuth()
    const { capitalize } = format

    const { toggleCustomDialog } = useCustomDialog({
      title: `Hola ${capitalize(user.value.name?.toLowerCase() ?? '')}, ¡lamentamos la falta de stock!. `,
      subtitle: `Puedes contarnos algo más o simplemente darle a enviar y nosotros contactaremos contigo cuando volvamos a tener stock de ${props.product.name}.`,
      product: props.product
    })

    return {
      toggleCustomDialog,
      url: process.env.IMAGES_URL,
    }
  }
})
</script>
