/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';

import { Product } from 'src/components/models';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: <Product[]>[]
  }),
  getters: {
    amount() {
      const amount: number = this.cart.reduce((acc, crr) => acc += crr.amount, 0);
      return amount;
    },
    cartCount():number {
      return this.cart.length
    }
  },
  actions: {
    updateCart(products: Product[]) {
      this.cart = products;
    },
    addOrUpdateProduct(product: Product) {
      const productIdx = this.cart.findIndex((p: Product) => p.uuid === product.uuid);

      if (product.quantity === -1) {
        this.cart = this.cart.filter(p => p.uuid !== product.uuid)
        console.log('entra')
      }

      if (productIdx !== -1) {
        const productToUpdate: Product = this.cart[productIdx];
        productToUpdate.amount = product.amount;
        productToUpdate.quantity = product.quantity;
      } else {
        console.log('adios')
        this.cart.push({...product, amount: product.price});
      }
    },
    addNewProductLine(product: Product) {
      this.cart.push({...product, amount: product.price})
    },
    removeFromCart(uuid: string) {
      this.cart = this.cart.filter(p => p.uuid !== uuid);
    }
  },
  persist: {
    enabled: true
  },
});
