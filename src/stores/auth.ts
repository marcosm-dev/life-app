/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { LocalStorage } from 'quasar';

export interface User {
  email: string
  password: string
}

export interface NewUser {
  name: string;
  lastName: string;
  VATIN: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    register: false,
    user: <NewUser>{},
  }),
  getters: {
    authenticated: (state) => !!Object.keys(state.user).length,
  },
  actions: {
    toggleRegister () {
      this.register = !this.register;
    },
    logout() {
      this.router.push('/');
      LocalStorage.clear();
      this.$reset();
    },
    async signup(user: User) {
      try {
        const { data } = await api.post('/auth/signup', user)
        return data;
      } catch (error: any) {
        const { response } = error;
        return { ...response.data }
      }
    },
    async login(user: User) {

      try {
        const { data } = await api.post('/auth/login', user)
        this.user = data;

        // Guardamos token en localStorage
        LocalStorage.set('token', data.token)
        return data
      } catch (error: any) {
        const { response } = error;
        console.log(response)
        return { ...response.data }
      }
    }
  },
  persist: {
    enabled: true
  }
});
