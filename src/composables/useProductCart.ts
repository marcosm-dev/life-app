import { storeToRefs } from 'pinia';
import { useCartStore } from 'src/stores/cart';
import { reactive, toRefs } from 'vue';
import { Product } from '../components/models';
import { uid } from 'quasar';

const useProductCart = (product: Product) => {
  const state = reactive({
    ...product,
    cartUid: uid(),
    quantity: 1
  });
  const store = useCartStore();

  function increase() {
    state.quantity++;
  }

  function decrease() {
    if (state.quantity !== 1) state.quantity--;
  }

  function addToCart() {
    store.addProduct(state);
  }

  function resetCart() {
    store.$reset();
  }

  function deleteProduct(uuid: string) {
    store.deleteProduct(uuid);
  }

  function updateCartItem(uid: string, action: string) {
    store.updateCartItem(uid, action);
  }
  return {
    ...toRefs(state),
    ...storeToRefs(store),
    deleteProduct,
    updateCartItem,
    resetCart,
    addToCart,
    state,
    increase,
    decrease
  };
};

export default useProductCart;
