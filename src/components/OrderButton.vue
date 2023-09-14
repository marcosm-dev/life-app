<template>
  <action-button
      @click="toggleCustomDialog"
      :padding="dense ? '5px 15px' : '20px'"
      :size="dense ? '11px' : '16px'"
      :class="dense ? 'border-radius-sm' : ''"
      class="Aeít-no- cuando lleguewrap col-12"
      :label="dense ? 'Solo bajo pedido' : 'Solo disponible bajo pedido'"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useCustomDialog from 'src/composables/useCustomDialog'
import { Product } from './models'

export default defineComponent({
  name: 'OrderButton',
  props: {
    dense: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object as () => Product,
      default: () => ({ id: 0, name: '', price: 0, quantity: 0 })
    }
  },
  setup(props) {
      const { toggleCustomDialog } = useCustomDialog({
        title: `Hola, vemos que estas interesado en <span class="text-capitalize text-bold">${props.product?.name.toLowerCase()}.</span>`,
        subtitle: 'Puedes contarnos algo más o simplemente darle a enviar y nosotros contactaremos contigo en la mayor brevedad.',
        product: props.product
      })
    return {
      toggleCustomDialog
    }
  }
})
</script>
