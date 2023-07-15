/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
// import { ApiClient } from 'admin-bro'

// const api = new ApiClient()
// fetching all records
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
