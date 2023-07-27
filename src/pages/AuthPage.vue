<template>
  <q-page
    v-show="!registerSuccess"
    class="justify-center items-center q-px-md q-mx-auto row bg-white"
    style="max-width: 450px"
  >
    <!-- MODAL DE CONFIRMACIÓN DE REGISTRO -->
    <q-dialog v-model="registerSuccess" @hide="registerSuccess = false">
      <q-card>
        <q-card-section class="text-h6 text-center">
          Gracias por registrarte
        </q-card-section>
        <q-card-section class="q-pt-none">
          En menos de 24 horas revisaremos tu solicitud. Recibirás una
          notificación por correo electrónico cuando esté aprobada.
        </q-card-section>
        <q-card-actions>
          <q-btn
            @click="reset"
            label="IR A PÁGINA DE INICIO"
            flat
            color="primary q-mx-auto"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- REGISTRO DE USUARIO -->
    <q-form
      v-if="register && !registerSuccess"
      class="col"
      @submit="onSignupSubmit"
    >
      <q-card
        class="row text-center justify-center q-px-none z-max text-dark"
        bordered
      >
        <h5 class="q-my-lg">Registrar</h5>
        <q-card-section class="col-12 q-gutter-y-md q-pt-none">
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
            outlined
            clearable
            v-model="newUser.address"
            label="Dirección"
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
        <q-card-actions class="col-12 justify-between">
          <q-btn
            @click.prevent="store.toggleRegister"
            label="Volver atrás"
            color="primary text-bold"
            flat
          />
          <q-btn
            type="submit"
            label="GUARDAR"
            color="secondary text-bold"
            flat
          />
        </q-card-actions>
      </q-card>
    </q-form>

    <!-- FIN REGISTRO DE USUARIO -->

    <!-- LOGIN DE USUARIO -->
    <q-form v-else-if="!register && !registerSuccess" @submit="onSubmit">
      <q-card
        class="row text-center justify-center q-px-none z-max text-dark"
        bordered
      >
        <h5 class="q-my-lg">Acceder</h5>
        <q-card-section class="col-12 q-gutter-y-md q-pt-none">
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
        <q-card-actions class="col-12 justify-around">
          <q-btn
            @click.prevent="store.toggleRegister"
            label="Registrar"
            color="primary text-bold"
            flat
          />
          <q-btn
            type="submit"
            label="Acceder"
            color="secondary text-bold"
            flat
            :loading="loading || loginLoading"
          />
        </q-card-actions>
        <q-card-section class="col-12 q-pt-none">
          <div class="row items-center">
            <q-separator class="col" size="2px" />
            <div class="col-auto q-px-sm text-no-wrap">
              INFORMACIÓN Y CONTACTO
            </div>
            <q-separator class="col" size="2px" />
          </div>
          <aside id="social-network" class="q-gutter-x-md full-width q-py-sm">
            <a href="https://www.instagram.com/serpica.sa">
              <q-icon size="25px" name="mdi-instagram" color="dark" />
            </a>
            <a href="https://www.homelife.it/es/download">
              <q-icon size="25px" name="mdi-web" color="dark" />
            </a>
            <q-icon
              tag="a"
              href="https://api.whatsapp.com/send?phone=657422136"
              size="26px"
              name="mdi-whatsapp"
              color="secondary cursor-pointer"
            />
          </aside>
          <q-card-section v-show="errors.length" class="text-negative">
            <q-list dense bordered padding class="rounded-borders">
              <q-item v-for="error in errors" clickable v-ripple :key="error">
                <q-item-section>
                  {{ error }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-form>

    <!-- FIN LOGIN DE USUARIO -->
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { useAuthStore, User, NewUser } from '../stores/auth';
import { useQuasar, QSpinnerGears } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import useHandleGraphqlErrors from '../composables/useHandleError';


export default defineComponent({
  name: 'AuthPage',
  setup() {
    const router = useRouter()
    const store = useAuthStore()
    const $q = useQuasar()
    const errors = ref<string[]>([])
    const revealPassword = ref(false)
    const registerSuccess = ref(false)
    const { register } = storeToRefs(store)

    const user: User = reactive({
      email: process.env.DEV ? 'marcosa.mm@icloud.com' : '',
      password: process.env.DEV ? '1234' : ''
    })

    const newUser: NewUser = reactive({
      name: '',
      lastName: '',
      VATIN: '',
      phone: '',
      address: '',
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
            phone
            address
            VATIN
          }
          token
        }
      }`)

    return {
      async onSignupSubmit() {
        errors.value = []
        $q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'positive',
          message: 'Registrando usuario ...'
        })

        delete newUser.confirmPassword

        try {
          const data = await mutate({ input: newUser })
          const signUp = data?.data.signUp
          if (signUp.error) {
            errors.value.push(signUp.error)
          }
          else store.setUser(signUp.user)
          registerSuccess.value = true
        } catch (error) {
          console.log(error)
        }
        $q.loading.hide()
      },
      async onSubmit() {
        errors.value = []
        $q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'positive',
          message: 'Espere ...'
        })
        try {
          const result = await loginMutation({ email: user.email, password: user.password })
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
  }
})
</script>
