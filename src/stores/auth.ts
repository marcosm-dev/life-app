/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { BeforeInstallPromptEvent } from '../components/models';
import { User } from '../components/models';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    register: false,
    deferredPrompt: <BeforeInstallPromptEvent>{},
    user: <User>{}
  }),
  getters: {
    authenticated: (state) => !!Object.keys(state.user).length
  },
  actions: {
    setDeferredPrompt(deferredPrompt: BeforeInstallPromptEvent) {
      console.log(deferredPrompt);
      this.deferredPrompt = deferredPrompt;
    },
    toggleRegister(val: any) {
      if (['undefined', 'boolean'].includes(typeof val)) {
        this.register = val;
      }
      this.register = !this.register;
    },
    setUser(user: User) {
      this.user = user;
      if (user.token) LocalStorage.set('token', user.token);
    }
  },
  persist: {
    enabled: true
  }
});
