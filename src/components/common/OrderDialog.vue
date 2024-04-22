<template>
  <q-dialog position="bottom" ref="dialogRef">
    <q-icon
      v-close-popup
      name="mdi-close"
      class="q-ml-auto"
      color="blue-grey-1"
      size="40px"
    />
    <div v-for="{product, amount} in products" :key="product.id" class="flex col-12 q-gutter-xs">
      <order-item :product="{ ...product, amount }" />
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar'
import OrderItem from '../order/OrderItem.vue'
const { dialogRef } = useDialogPluginComponent()
const props = defineProps({
  products: {
    type: Object,
    default: () => ({})
  },
})

</script>
