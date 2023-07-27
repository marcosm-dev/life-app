/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

export interface User {
  email: string
  password: string
}

export interface NewUser {
  name: string
  lastName: string
  VATIN: string
  phone: string
  address: string
  email: string
  password: string
  confirmPassword?: string
  token?: string
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
      this.register = !this.register
    },
    logout() {
      this.router.push('/')
      LocalStorage.clear()
      this.$reset()
    },
    setUser(user: NewUser) {
      this.user = user
      if (user.token) LocalStorage.set('token', user.token)
    },
  },
  persist: {
    enabled: true
  }
})
