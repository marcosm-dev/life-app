/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { Product } from 'src/components/models'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: <Product[]>[],
    loading: false,
    productQuantity: 0
  }),
  getters: {
    amount() {
      const amount: number = this.cart.reduce(
        (acc, crr) => (acc += crr.price * crr.quantity),
        0
      )
      return amount
    },
    cartCount(): number {
      return this.cart.reduce((acc, crr) => (acc += crr.quantity), 0)
    },
    cartIds(): string[] {
      const products: string[] = []
      this.cart.forEach((item: Product) => {
        for (let i = 0; i < item.quantity; i++) {
          products.push(item.id)
        }
      })

      return products
    }
  },
  actions: {
    toggleLoading(val?: boolean) {
      if (val) this.loading = val
      else this.loading = false
    },
    deleteProduct(uuid: string) {
      this.cart = this.cart.filter((item) => item.cartUid !== uuid)
    },
    addProduct(product: Product) {
      this.toggleLoading(true);
      this.cart.push(product)
    },
    updateCartItem(uid: string, action: string) {
      console.log(uid)
      console.log(action)
      const index = this.cart.findIndex((item) => item.cartUid === uid)
      console.log(this.cart[index].quantity)
      if (this.cart[index].quantity === 1 && action === '-') {
        this.cart =  this.cart.filter((it) => it.cartUid !== uid)
        return
      }
      if (index !== -1) {
        const updatedItem: Product = { ...this.cart[index] }
        // Realizar las modificaciones necesarias en updatedItem según la acción
        if (action === '+' && updatedItem.quantity) {
          updatedItem.quantity++
        } else if (
          action === '-' &&
          updatedItem.quantity &&
          updatedItem.quantity > 1
        ) {
          updatedItem.quantity--
        }
        // Actualizar el elemento en el arreglo
        this.cart[index] = updatedItem
      }
    }
  },
  persist: {
    enabled: true
  }
})
