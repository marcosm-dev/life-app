/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { BeforeInstallPromptEvent } from '../components/models'
import { User } from '../components/models'
import { LocalStorage } from 'quasar'

type Banners = {
  menu: boolean
  payment: boolean
  signup: boolean
  [key: string]: boolean // Agregar una firma de índice que acepte claves de tipo "string"
}


export const useAuthStore = defineStore('auth', {
  state: () => ({
    register: false,
    deferredPrompt: null as BeforeInstallPromptEvent | null,
    user: {} as User,
    neverShowAppInstallBanner: false,
    temporalHideBanner: false,
    title: '¿Que tipo de producto buscas?',
    hideBanners: {
      menu: false,
      payment: false,
      signup: false
    } as Banners
  }),
  getters: {
    authenticated: (state) => {
      if (!state.user.token) return false
      return !!Object.keys(state.user).length
    },
    hideBanner() {
      if (Object.values(this.hideBanner).includes(true) || !this.deferredPrompt?.prompt) return true
      return false
    },
  },
  actions: {
    toggleNeverShowAppInstallBanner(val: boolean) {
      if (val) return (this.neverShowAppInstallBanner = val)
      return (this.neverShowAppInstallBanner = !this.neverShowAppInstallBanner)
    },
    setDeferredPrompt(deferredPrompt: BeforeInstallPromptEvent) {
      this.deferredPrompt = deferredPrompt
    },
    toggleRegister(val: any) {
      if (['undefined', 'boolean'].includes(typeof val)) {
        this.register = val
      }
      this.register = !this.register
    },
    setUser(user: User) {
      this.user = user
      if (user.token) LocalStorage.set('token', user.token)
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'temporalHideBanner',
        storage: sessionStorage,
        paths: ['user', 'deferredPrompt']
      }
    ]
  }
})
