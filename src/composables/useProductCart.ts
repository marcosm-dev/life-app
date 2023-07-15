import { storeToRefs } from 'pinia';
import { Product } from 'src/components/models';
import { useCartStore } from 'src/stores/cart';

import { uid } from 'quasar';

const useProductCart = () => {

  const store = useCartStore();
  const { cart, amount } = storeToRefs(store);

  function addOrUpdateProduct(product: Product) {

    const uuid = uid();
    const amount = product.price * product.quantity;

    product.amount = amount;

    if (!product.uuid) product.uuid = uuid;

    store.addOrUpdateProduct({ ...product })
  }

  function updateCart(products: Product[]){
    store.updateCart(products);
  }

  function resetCart() {
    store.$reset();
  }

  return {
    addOrUpdateProduct,
    updateCart,
    resetCart,
    amount,
    cart
  }

}

export default useProductCart;
