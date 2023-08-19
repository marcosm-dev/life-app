/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { BeforeInstallPromptEvent } from '../components/models';
import { User } from '../components/models';
import { LocalStorage } from 'quasar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    register: false,
    deferredPrompt:  null as BeforeInstallPromptEvent  |  null,
    user: {} as User,
    neverShowAppInstallBanner: false,
    temporalHideBanner: false,
    hideBanners: {
      menu: false,
      payment: false,
      signup: false,
    }
  }),
  getters: {
    authenticated: (state) => {
      if  (!state.user.token) return false
      return !!Object.keys(state.user).length
    }
  },
  actions: {
    toggleNeverShowAppInstallBanner(val: boolean) {
      if (val)  return this.neverShowAppInstallBanner = val
      return this.neverShowAppInstallBanner = !this.neverShowAppInstallBanner
    },
    setDeferredPrompt(deferredPrompt: BeforeInstallPromptEvent) {
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
      if (user.token) LocalStorage.set('token', user.token)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'temporalHideBanner',
        storage: sessionStorage,
        paths:  ['user', 'deferredPrompt']
      },
    ]
  }
});
