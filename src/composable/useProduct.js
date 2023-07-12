import { ref } from 'vue';

const useProduct = ({ price }) => {
  const quantity = ref(0);

  function increase() {
    quantity.value += 1;
  }
  function decrease() {
    quantity.value
  }

  return {
    increase,
    decrease,
    quantity,
  }
}

export default useProduct;
