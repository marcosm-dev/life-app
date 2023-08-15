<template>
  <q-page
    v-show="!registerSuccess" style="max-width: 450px">
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
        <q-card-actions class="col q-pb-lg">
          <q-btn
            @click="reset"
            label="Iniciar sesión"
            rounded
            color="primary q-mx-auto"
          />
        </q-card-actions>
        <q-card-section class="no-padding col">
          <banner-install-app  />
        </q-card-section>
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
    <q-form v-else-if="!register && !registerSuccess" @submit="onSubmit" class="q-px-md absolute-center full-width">
      <q-card
        class="row text-center justify-center q-px-none q-py-md z-max text-dark shadow-15"
      >
       <q-card-section>
          <q-img
            class="col-12"
            src="~assets/logo.jpg"
            fetchpriority="high"
            width="200px"
            height="70px"
            alt="serpica life logo"
            loading="lazy"
          />
          <div class="q-my-lg text-body1 knockout col-12">
            Inicia sesión con tu cuenta en Serpica life o create una y pulsando
            <span class="text-body1 text-bold knockout" @click="store.toggleRegister">
              aquí, <u class="text-body1 text-bold knockout">registrarse</u>.
            </span>
          </div>
       </q-card-section>
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
        <q-card-actions class="col-12 justify-around q-pa-lg">
          <q-btn
            type="submit"
            no-caps
            padding="5px 20px"
            text-color="blue-grey-13"
            label="Acceder como usuario"
            outline
            dense
            class="text-subtitle1"
            :loading="loading || loginLoading"
          />
        </q-card-actions>
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
import BannerInstallApp from 'src/components/BannerInstallApp.vue';

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
  components: { BannerInstallApp }
})
</script>
