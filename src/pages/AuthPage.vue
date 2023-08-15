<template>
  <q-page class="row justify-center items-center">
    <!-- MODAL DE CONFIRMACIÓN DE REGISTRO -->
    <q-dialog v-model="registerSuccess" @hide="registerSuccess = false">
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
          />
        </q-card-actions>
        <q-card-section class="no-padding col">
          <banner-install-app sign-up />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- LOGIN Y REGISTRO DE USUARIO -->
    <q-form class="q-px-md col q-pt-xl" v-show="!registerSuccess" style="max-width: 450px">
       <q-card class="row text-center justify-center q-px-none q-py-md z-max text-dark shadow-15">
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
          <div class="q-my-lg text-body1 knockout col-12">
            <template v-if="!register">
                Inicia sesión con tu cuenta en {{ name }} o create una y pulsando
              <span class="text-body1 knockout" @click="store.toggleRegister">
                aquí, <u class="cursor-pointer text-body1 text-bold knockout">registrarse</u>.
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
            clearable
            v-model="newUser.name"
            label="Nombre"
            lazy-rules
          />
          <q-input
            outlined
            clearable
            type="text"
            v-model="newUser.lastName"
            label="Apellidos"
          />
          <q-input
            outlined
            clearable
            v-model="newUser.VATIN"
            label="CIF o DNI"
            lazy-rules
          />
          <q-input
            outlined
            clearable
            type="text"
            v-model="newUser.phone"
            error-message="Por favor ingresa un email válido."
            :error="errorHandler"
            label="Teléfono"
          />
          <q-input
            type="text"
            outlined
            clearable
            v-model="newUser.address"
            label="Dirección"
          />
          <q-input
            outlined
            clearable
            v-model="newUser.zipCode"
            label="Código Postal"
          />
          <q-input
            outlined
            clearable
            v-model="newUser.city"
            label="Ciudad"
          />
          <q-input
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
            clearable
            v-model="user.email"
            label="Email"
            lazy-rules
            error-message="Por favor, ingresa con un email de usuario válido"
            :rules="[(val) => /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(val)]"
          />
          <q-input
            outlined
            clearable
            type="text"
            error-message="Por favor, ingresa bien tu contraseña"
            v-model="user.password"
            :error="errorHandler"
            label="Contraseña"
          />
        </q-card-section>
        <q-card-section class="col-12 q-px-none q-pb-none">
          <q-separator size="2px" />
        </q-card-section>
        <q-card-section v-show="errors.length" class="text-negative">
          <q-list dense bordered padding class="rounded-borders">
            <q-item v-for="error in errors" clickable v-ripple :key="error">
              <q-item-section>
                {{ error }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions class="col-12 justify-around q-pa-lg">
          <action-button
            v-if="!register"
            @click="onSubmit"
            :label="'Acceder como usuario'"
          />

          <template v-else>
            <q-btn
              @click="store.toggleRegister"
              label="Iniciar sesión"
              flat
              no-caps
            />
            <action-button
              @click="onSignupSubmit"
              :label="'Guardar'"
              icon-right="mdi-content-save"
              flat
            />
          </template>
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
import { useAuthStore, User, NewUser } from '../stores/auth';
import { useQuasar, QSpinnerGears } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
// En tu componente Vue o archivo TypeScript
import * as manifest from '../../src-pwa/manifest.json'

import useHandleGraphqlErrors from '../composables/useHandleError'
// import useNotifyError from '../composables/useNotifyError'

export default defineComponent({
  name: 'AuthPage',
  setup() {
    const router = useRouter()
    const store = useAuthStore()
    // const { notifyError } = useNotifyError()
    const $q = useQuasar()
    const errors = ref<string[]>([])
    const revealPassword = ref(false)
    const registerSuccess = ref(false)
    const { register } = storeToRefs(store)
    const { name } = manifest
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

    const { mutate, loading } = useMutation(gql`
      mutation signUp($input: UserInput!) {
        signUp(input: $input) {
          error
          user {
            id
            email
            name
            lastName
            zipCode,
            city
            phone
            address
            VATIN
          }
          token
        }
      }
    `)

    const { mutate: loginMutation, loading: loginLoading } = useMutation(gql`
      mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          user {
            id
            email
            name
            lastName
            zipCode,
            city
            phone
            address
            VATIN
            uuid
          }
          token
        }
      }`)

    return {
      async onSignupSubmit() {
        if (Object.values(newUser).includes('') || Object.values(newUser).includes(null)) return
        errors.value = []
        $q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'positive',
          message: 'Registrando usuario ...'
        })

        newUser.email = newUser.email.toLowerCase()

        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { confirmPassword, ...userClean } = newUser
          const data = await mutate({ input: userClean })

          const signUp = data?.data.signUp
          if (signUp.error) {
            errors.value.push(signUp.error)
          }
          else store.setUser(signUp.user)
          registerSuccess.value = true
        } catch (error: any) {
          errors.value.push(useHandleGraphqlErrors(error))
        }
        $q.loading.hide()
      },
      async onSubmit() {
        console.log(user)
        if (Object.values(user).includes('') || Object.values(user).includes(null)) return
        errors.value = []
        $q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'positive',
          message: 'Espere ...'
        })
        try {
          const result = await loginMutation({ email: user.email.toLowerCase(), password: user.password })
          if (result?.data?.loginUser?.token) {
            const { token, user } = result?.data.loginUser
            store.setUser({...user, token})
            router.push('/home')
          }
        } catch (error: any) {
          errors.value.push(useHandleGraphqlErrors(error))
          console.log(error)
        }
        $q.loading.hide()
      },
      errorHandler: computed(() =>
        errors.value.some((err) => err.includes('Contraseña'))
      ),
      reset: () => {
        router.push(`/?${Date.now()}`)
        store.toggleRegister()
      },
      heandleEmailError: computed(() => {
        for (const error of errors.value) {
          return error.includes(newUser.email)
        }
        return false
      }),
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      addressRef,
      name,
      loading,
      loginLoading,
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
