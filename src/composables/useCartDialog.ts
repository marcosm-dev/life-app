import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/cart'
import { reactive } from 'vue'

import DialogComponent from 'components/DialogComponent.vue'

const useCartDialog = () => {
  const $q = useQuasar()
  const state = reactive({
    open: false
  })
  const store = useCartStore()
  const { cart, cartCount } = storeToRefs(store)

  function toggleCartDialog() {
    state.open = !state.open

    if (state.open) {
      $q.dialog({
        title: 'Positioned',
        position: 'bottom',
        component: DialogComponent,
        componentProps: {
          products: store.cart
        }
      })
      .onDismiss(() => toggleCartDialog())
    }
  }

  return {
    cart,
    state,
    cartCount,
    toggleCartDialog
  }
}
export default useCartDialog
