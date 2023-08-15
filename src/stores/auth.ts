/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { BeforeInstallPromptEvent } from '../components/models';

export interface User {
  email: string;
  password: string;
}

export interface NewUser {
  name: string;
  lastName: string;
  VATIN: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  email: string;
  password: string;
  confirmPassword?: string;
  token?: string;
  uuid?: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    register: false,
    deferredPrompt: <BeforeInstallPromptEvent>{},
    user: <NewUser>{}
  }),
  getters: {
    authenticated: (state) => !!Object.keys(state.user).length
  },
  actions: {
    setDeferredPrompt(deferredPrompt: BeforeInstallPromptEvent) {
      console.log(deferredPrompt);
      this.deferredPrompt = deferredPrompt;
    },
    toggleRegister() {
      this.register = !this.register;
    },
    logout() {
      this.router.push('/');
      LocalStorage.clear();
      this.$reset();
    },
    setUser(user: NewUser) {
      this.user = user;
      if (user.token) LocalStorage.set('token', user.token);
    }
  },
  persist: {
    enabled: true
  }
});
