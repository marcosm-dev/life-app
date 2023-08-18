<template>
  <q-page class="row justify-center items-center">
    <!-- MODAL DE CONFIRMACIÓN DE REGISTRO -->
    <q-dialog v-model="registerSuccess">
      <q-card class="column">
        <q-card-section class="text-h6 text-center col">
          Gracias por registrarte
        </q-card-section>
        <q-card-section class="q-pt-none col">
          En menos de 24 horas revisaremos tu solicitud. Recibirás una
          notificación por correo electrónico cuando esté aprobada.
        </q-card-section>
        <q-card-actions class="col q-pb-lg justify-center">
          <action-button
            @click="reset"
            :label="'Iniciar sesión'"
            outline
            neutro
          />
        </q-card-actions>
        <q-card-section class="no-padding col">
          <banner-install-app sign-up />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- LOGIN Y REGISTRO DE USUARIO -->
    <q-form @submit="onSubmit" class="q-px-md col q-pt-xl" style="max-width: 450px;">
       <q-card class="row text-center justify-center q-px-none q-py-md text-dark shadow-15 rounded-card">
       <q-card-section>
          <q-img
            class="col-12"
            src="~assets/logo.jpg"
            fetchpriority="high"
            width="180px"
            height="70px"
            alt="serpica life logo"
            loading="lazy"
          />
          <div class="q-my-lg text-body col-12" :class="$q.screen.gt.sm ? '' : 'q-px-lg'">
            <template v-if="!register">
                Inicia sesión con tu cuenta en {{ name }} o create una y pulsando
              <span class="text-body1 knockout" @click="store.toggleRegister">
                en, <u class="cursor-pointer text-body1 knockout">registrarse</u>.
              </span>
            </template>
            <template v-else>
                Crea una cuenta en {{ name }}
            </template>
          </div>
       </q-card-section>
        <q-card-section v-if="register" class="col-12 q-gutter-y-md q-pt-none">
          <q-input
            outlined
            color="blue-grey-14"
            clearable
            v-model="newUser.name"
            label="Nombre"
            rounded
            lazy-rules
          />
          <q-input
            outlined
            color="blue-grey-14"
            rounded
            clearable
            type="text"
            v-model="newUser.lastName"
            label="Apellidos"
          />
          <q-input
            outlined
            color="blue-grey-14"
            rounded
            clearable
            v-model="newUser.VATIN"
            label="CIF o DNI"
            lazy-rules
          />
          <q-input
            outlined
            color="blue-grey-14"
            rounded
            clearable
            type="text"
            v-model="newUser.phone"
            error-message="Por favor ingresa un email válido."
            :error="errorHandler"
            label="Teléfono"
          />
          <q-input
            rounded
            color="blue-grey-14"
            outlined
            type="text"
            clearable
            v-model="newUser.address"
            label="Dirección"
          />
          <q-input
            rounded
            color="blue-grey-14"
            outlined
            clearable
            v-model="newUser.zipCode"
            label="Código Postal"
          />
          <q-input
            rounded
            color="blue-grey-14"
            outlined
            clearable
            v-model="newUser.city"
            label="Ciudad"
          />
          <q-input
            rounded
            color="blue-grey-14"
            outlined
            clearable
            type="text"
            v-model="newUser.email"
            :error="heandleEmailError"
            label="Email"
            :rules="[
              (val) => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(val),
            ]"
            lazy-rules
          />
          <q-input
            rounded
            color="blue-grey-14"
            outlined
            clearable
            v-model="newUser.password"
            label="Contraseña"
            lazy-rules
            :type="revealPassword ? 'text' : 'password'"
            error-message="Las contraseñas no coinciden"
          >
            <template #append>
              <q-icon
                :name="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="cursor-pointer"
                @click="revealPassword = !revealPassword"
              />
            </template>
          </q-input>
          <q-input
             rounded
            color="blue-grey-14"
            :type="revealPassword ? 'text' : 'password'"
            label="Confirmar contraseña"
            outlined
            clearable
            lazy-rules
            error-message="Las contraseñas no coinciden"
            v-model="newUser.confirmPassword"
            :rules="[(val) => val === newUser.password]"
          >
            <template #append>
              <q-icon
                :name="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="cursor-pointer"
                @click="revealPassword = !revealPassword"
              />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section v-else class="col-12 q-gutter-y-md q-pt-none">
          <q-input
            outlined
            color="blue-grey-14"
            clearable
            v-model="user.email"
            label="Email"
            rounded
            lazy-rules
            item-aligned
            error-message="Por favor ingresa un email válido."
            :rules="[(val) => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(val)]"
          />
          <q-input
            outlined
            color="blue-grey-14"
            clearable
            item-aligned
            rounded
            :type="revealPassword ? 'text' : 'password'"
            error-message="Por favor, ingresa bien tu contraseña"
            v-model="user.password"
            :error="errorHandler"
            label="Contraseña"
          >
             <template #append>
                <q-icon
                  :name="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  class="cursor-pointer"
                  @click="revealPassword = !revealPassword"
                />
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="col-12 q-px-none q-pb-none">
          <q-separator size="2px" />
        </q-card-section>
        <!-- <q-card-section v-show="errors.length" class="text-accent">
          <q-list dense bordered padding style="border-radius: 26px;">
            <q-item v-for="error in errors" :key="error">
              <q-item-section class="text-caption">
                {{ error }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section> -->
        <q-card-actions class="col-12 justify-around q-pa-lg">
          <action-button
            v-if="!register"
            label="Acceder"
            type="submit"
            style="width: 50%;"
            :loading="loginLoading"
            neutro
          />

          <div class="row justify-between" v-else>
            <q-checkbox
              v-model="check"
              class="q-mb-xl text-body2 no-padding text-left text-no-wrap ellipsis"
            >
              He leído y acepto la <u>política de privacidad</u>.
            </q-checkbox>
            <action-button
              @click="store.toggleRegister"
              label="Iniciar sesión"
              flat
              neutro
            />
            <action-button
              type="submit"
              :loading="signUpLoading"
              label="Guardar"
              icon-right="mdi-content-save"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-form>

    <!-- FIN LOGIN DE USUARIO -->
  </q-page>
</template>

<script lang="ts">

import {
  defineComponent,
  reactive,
  ref,
  computed,
} from 'vue'
import { useAuthStore, User, NewUser } from '../stores/auth'
import { useQuasar, LocalStorage } from 'quasar'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import * as manifest from '../../src-pwa/manifest.json'

import useHandleGraphQLErrors from '../composables/useHandleError'
import useAuth from '../composables/useAuth';
import { resetCaches } from 'graphql-tag'

export default defineComponent({
  name: 'AuthPage',
  setup() {
    const {
      loginMutation,
      logoutUser,
      loading,
      signUpMutation,
      signUpLoading,
      loginLoading
    } = useAuth()
    const router = useRouter()
    const store = useAuthStore()
    const $q = useQuasar()
    const errors = ref<string[]>([])
    const revealPassword = ref(false)
    const registerSuccess = ref(false)
    const { register } = storeToRefs(store)
    const { name } = manifest
    const check = ref(false)
    const addressRef = ref(null)

    const user: User = reactive({
      email: process.env.DEV ? 'marcosm.lp86@gmail.com' : '',
      password: process.env.DEV ? '1111' : ''
    })

    const newUser: NewUser = reactive({
      name: '',
      lastName: '',
      VATIN: '',
      phone: '',
      address: '',
      zipCode: '',
      city: '',
      email: '',
      password: '',
      confirmPassword: ''
    })



    async function login() {
        const length = LocalStorage.getLength()
        if (length) {
          LocalStorage.clear()
        }
        if (Object.values(user).includes('') || Object.values(user).includes(null)) return
        errors.value = []
        try {
          const result = await loginMutation({ email: user.email.toLowerCase(), password: user.password })
          if (result?.data?.loginUser?.token) {
            const { token, user } = result?.data.loginUser
            store.setUser({...user, token})
            router.push('/')
          }
        } catch (error: any) {
          errors.value.push(error.message)
          useHandleGraphQLErrors(error)
        }
        $q.loading.hide()
      }

    async function signUp() {
      errors.value = []
      if (!check.value) {
        errors.value.push('Debes leer y aceptar nuestra política de privacidad para continuar tu regisro.')
        return
      }
      if (Object.values(newUser).includes('') || Object.values(newUser).includes(null)) return
      errors.value = []
      newUser.email = newUser.email.toLowerCase()

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...userClean } = newUser
        const data = await signUpMutation({ input: userClean })

        const signUp = data?.data.signUp
        if (signUp.error) {
          errors.value.push(signUp.error)
        }
        else store.setUser(signUp.user)
        registerSuccess.value = true
      } catch (error: any) {
        errors.value.push(error.message)
        useHandleGraphQLErrors(error)
      }
      $q.loading.hide()
    }

    function reset ()  {
      store.toggleRegister(false)
      registerSuccess.value = false
      register.value = false
    }

    onBeforeRouteLeave(() => {
      resetCaches();
    })


    return {
      async onSubmit() {
        if (register.value) await signUp()
        else await login()
      },

      errorHandler: computed(() =>
        errors.value.some((err) => err.includes('Contraseña'))
      ),





      heandleEmailError: computed(() => {
        for (const error of errors.value) {
          return error.includes(newUser.email)
        }
        return false
      }),
      reset,
      loginLoading,
      signUpLoading,
      logoutUser,
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      loading,
      addressRef,
      check,
      name,
      registerSuccess,
      revealPassword,
      register,
      newUser,
      errors,
      user,
      store
    }
  },
})
</script>
