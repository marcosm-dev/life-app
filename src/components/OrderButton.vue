<template>
  <action-button
      @click="toggleCustomDialog"
      :padding="dense ? '5px 15px' : '20px'"
      :size="dense ? '11px' : '16px'"
      :class="dense ? 'border-radius-sm' : ''"
      class="no-wrap col-12"
      :label="dense ? $t('product.onlyByOrderShort') : $t('product.onlyByOrder')"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useCustomDialog from 'src/composables/useCustomDialog'
import { Product } from './models'
import { useI18n } from 'vue-i18n';

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
      const { t } = useI18n()
      const { toggleCustomDialog } = useCustomDialog('request', props.product)
    return {
      toggleCustomDialog
    }
  }
})
</script>
