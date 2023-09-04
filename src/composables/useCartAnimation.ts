import { storeToRefs } from 'pinia'
import { useCartStore } from 'src/stores/cart'

const useCartAnimation = () => {
  const store = useCartStore()

  const toggle = (val?: boolean) => store.toggleLoading(val)

  return {
    toggle,
    ...storeToRefs(store)
  }
}

export default useCartAnimation
