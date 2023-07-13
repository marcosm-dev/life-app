import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useCartStore } from 'src/stores/cart';
import { reactive } from 'vue';

import DialogComponent from 'components/DialogComponent.vue'

const useCartDialog = () => {
  const $q = useQuasar();
  const state = reactive({
    open: false,
  })
  const store = useCartStore();
  const { cart } = storeToRefs(store);

  function toggleCartDialog() {
    state.open = !state.open;

    if (state.open) {
      $q.dialog({
        title: 'Positioned',
        position: 'bottom',
        component: DialogComponent,
        componentProps: {
          products: cart.value
        },
      })
      .onDismiss(() => toggleCartDialog())
    }
  }

  return {
    cart,
    state,
    toggleCartDialog,
  }
}
export default useCartDialog;
