/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { LocalStorage } from 'quasar';

import { Product } from 'src/components/models';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: <Product[]>[]
  }),
  getters: {},
  actions: {
    addOrUpdateProduct(product: Product) {
      console.log(product)
      const productIdx = this.cart.findIndex((p: Product) => p.id === product.id) ?? null
      if (productIdx !== -1) {
        const productToUpdate: Product = this.cart[productIdx]
        productToUpdate.quantity += product.quantity;
      } else {
        this.cart.push(product);
      }
    },
    removeFromCart(productId: number) {
      this.cart = this.cart.filter(p => p.id === productId);
    }
  },
  persist: {
    enabled: true
  },
});
