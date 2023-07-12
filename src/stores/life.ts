/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { LocalStorage } from 'quasar';

export const useLifeStore = defineStore('life', {
  state: () => ({

  }),
  getters: {},
  actions: {
    async getCategoryProducts(categoryId: number) {
      const { data } = await api.get(`/products/category/${categoryId}`);
      return data;
    },
    async getCategories() {
      const { data } = await api.get('/categories');
      return data;
    }
  },
  persist: {
    enabled: true
  }
});
