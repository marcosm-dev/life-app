<template>
  <q-page class="column justify-center" padding>
    <!-- MODAL DE CONFIRMACIÓN DE REGISTRO -->
    <q-dialog v-model="registerSuccess">
      <q-card class="column rounded-card q-pb-none">
        <q-card-section class="text-h6 text-center col">
          {{ $t('auth.signUp.success.title') }}
        </q-card-section>
        <q-card-section class="q-pt-none col">
          {{ $t('auth.signUp.success.subtitle') }}
        </q-card-section>
        <q-card-actions class="col q-pb-lg justify-center">
          <action-button
            @click="reset"
            :label="$q.lang.label.close"
            padding="10px 40px"
            outline
            dense
            neutro
          />
        </q-card-actions>
        <banner-install-app type="SignUp" />
      </q-card>
    </q-dialog>

    <!-- LOGIN Y REGISTRO DE USUARIO -->
    <q-form @submit="onSubmit" class="row justify-center items-center">
      <!-- :style="register && 'margin-bottom: 10em'" -->
      <q-card
        class="col-12 justify-center q-px-none q-py-md text-dark shadow-15 rounded-card"
        style="max-width: 400px"
      >
        <q-card-section class="text-center q-py-none">
          <q-icon name="svguse:icons.svg#life_logo" size="100px" />
          <q-card-section class="text-body q-pt-none">
            <template v-if="!register">
              <!-- {{ t('auth.login.title', { name }) }} -->
              <i18n-t keypath="auth.login.title" scope="global">
                <template #name>
                  <b>Serpica Canarias</b>
                </template>
              </i18n-t>
              <!-- Inicia sesión con tu cuenta en<br><strong class="text-blue-grey-14">{{ name }}</strong> -->
              <span class="text-body1" @click="store.toggleRegister">
                <div class="text-body2 q-mt-sm">
                  {{ $t('auth.login.subtitle') }}
                </div>
                <u
                  class="cursor-pointer text-subtitle1 knockout text-blue-grey-14"
                  >{{ $t('auth.login.signUpAction') }}</u
                >
              </span>
            </template>
            <template v-else>
              {{ $t('auth.signUp.title', { name: 'Serpica Canarias' }) }}
            </template>
          </q-card-section>
        </q-card-section>
        <q-card-section v-if="register" class="col-12 q-gutter-y-md q-pb-none">
          <q-input
            v-model="newUser.name"
            outlined
            color="blue-grey-14"
            clearable
            :label="$t('auth.form.name')"
            rounded
            lazy-rules
          />
          <q-input
            rounded
            color="blue-grey-14"
            outlined
            clearable
            type="text"
            :error-message="$t('auth.errors.email')"
            v-model="newUser.email"
            :error="heandleEmailError"
            :label="$t('auth.form.email')"
            :rules="[
              (val) =>
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                  val
                )
            ]"
            lazy-rules
          />
          <q-input
            v-model="newUser.phone"
            outlined
            color="blue-grey-14"
            clearable
            :label="$t('auth.form.phone')"
            rounded
            lazy-rules
          />
          <q-input
            rounded
            color="blue-grey-14"
            outlined
            clearable
            v-model="newUser.password"
            :label="$t('auth.form.password')"
            lazy-rules
            :type="revealPassword ? 'text' : 'password'"
            :error-message="$t('auth.errors.password')"
          >
            <template #append>
              <q-icon
                :name="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="cursor-pointer"
                @click="revealPassword = !revealPassword"
              />
            </template>
          </q-input>
          <q-card-section class="no-padding q-gutter-y-md">
            <div class="text-center">
              <q-btn
                rounded
                @click="extraForm = !extraForm"
                class="q-mx-auto"
                :label="
                  extraForm
                    ? $t('auth.signUp.preferLater')
                    : $t('auth.signUp.fullProfile')
                "
                text-color="info"
                no-caps
                flat
                :icon-right="
                  extraForm ? 'mdi-arrow-up-circle' : 'mdi-arrow-down-circle'
                "
              />
            </div>
            <transition-group
              appear
              tag="div"
              enter-active-class="animated slideInDown"
              v-if="extraForm"
              class="q-gutter-y-md extra-form q-mt-lg"
            >
              <q-input
                key="lastName"
                v-model="newUser.lastName"
                outlined
                color="blue-grey-14"
                rounded
                clearable
                :label="$t('auth.form.lastName')"
                type="text"
              />
              <q-input
                key="VATIN"
                outlined
                color="blue-grey-14"
                rounded
                clearable
                v-model="newUser.VATIN"
                :label="$t('auth.form.VATIN')"
                lazy-rules
              />
              <q-input
                key="address"
                rounded
                color="blue-grey-14"
                outlined
                type="text"
                clearable
                v-model="newUser.address"
                :label="$t('auth.form.address')"
              />
              <q-input
                key="zipCode"
                rounded
                color="blue-grey-14"
                outlined
                clearable
                v-model="newUser.zipCode"
                :label="$t('auth.form.postalCode')"
              />
              <q-input
                key="city"
                rounded
                color="blue-grey-14"
                outlined
                clearable
                v-model="newUser.city"
                :label="$t('auth.form.city')"
              />
            </transition-group>
          </q-card-section>
        </q-card-section>
        <q-card-section v-else class="col-12 q-gutter-y-md q-pt-none">
          <q-input
            outlined
            color="blue-grey-14"
            clearable
            v-model="userCreedentials.email"
            label="Email"
            rounded
            lazy-rules
            item-aligned
            :error-message="$t('auth.errors.email')"
            :rules="[
              (val) =>
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                  val
                )
            ]"
          />
          <q-input
            outlined
            color="blue-grey-14"
            clearable
            item-aligned
            rounded
            :type="revealPassword ? 'text' : 'password'"
            :error-message="$t('auth.errors.wrongPassword')"
            v-model="userCreedentials.password"
            :error="errorHandler"
            :label="$t('auth.form.password')"
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
        <q-card-actions v-if="!register" class="row justify-center">
          <action-button
            :label="$t('common.access')"
            type="submit"
            style="width: 50%"
            :loading="loginLoading"
            neutro
          />
          <action-button
            @click="toggleCustomDialog"
            :label="$t('auth.recovery')"
            flat
            class="q-mt-lg col-12"
            text-color="blue-grey-14"
            style="text-decoration: underline"
            neutro
          />
        </q-card-actions>
        <q-card-actions class="row justify-between q-mx-sm" v-else>
          <q-checkbox
            v-model="check"
            class="text-body2 col-12 text-no-wrap q-mb-xl q-mt-md"
          >
            <i18n-t keypath="auth.privacyPolicyMessage" scope="global">
              <template #privacy>
                <u>{{ $t('common.privacyPolicy') }}</u>
              </template>
            </i18n-t>
          </q-checkbox>
          <action-button
            @click="store.toggleRegister"
            icon="mdi-arrow-left"
            outline
            neutro
            rounded
            :label="$t('common.back')"
            no-caps
            class="col"
            color="blue-grey-13"
          />
          <action-button
            type="submit"
            class="col"
            :loading="signUpLoading"
            :label="$q.lang.label.create"
          />
        </q-card-actions>
      </q-card>
    </q-form>
    <!-- FIN LOGIN DE USUARIO -->
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import { useQuasar, LocalStorage } from 'quasar'
import { useRouter, onBeforeRouteLeave, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { resetCaches } from 'graphql-tag'
import { format } from 'quasar'
import useNotifyError from '../composables/useNotifyError'
import useAuth from '../composables/useAuth'
import useCustomDialog from 'src/composables/useCustomDialog'
import { ISignUpUser, ILoginUser } from 'components/models'

function cleanEmptyValues(obj: any) {
  for (const key in obj) {
    if (/^\s*$/.test(obj[key])) {
      delete obj[key]
    }
  }
  return obj
}

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
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const { store, register, user } = useAuth()
    const $q = useQuasar()
    const { capitalize } = format
    const errors = ref<string[]>([])
    const revealPassword = ref(false)
    const registerSuccess = ref(false)

    const check = ref(false)
    const extraForm = ref(false)

    const userCreedentials: ILoginUser = reactive({
      email: process.env.DEV ? 'marcosm.lp86@gmail.com' : '',
      password: process.env.DEV ? '1111' : ''
    })

    const newUser: ISignUpUser = reactive({
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

    const { toggleCustomDialog } = useCustomDialog('recovery')

    async function login() {
      LocalStorage.clear()
      if (
        Object.values(user).includes('') ||
        Object.values(user).includes(null)
      )
        return
      errors.value = []
      try {
        const result = await loginMutation({
          email: userCreedentials.email.toLowerCase(),
          password: userCreedentials.password
        })
        if (result?.data?.loginUser?.token) {
          const { token, user } = result?.data.loginUser
          store.setUser({ ...user, token })
          router.push('/')
        }
      } catch (error) {
        if (error) {
          errors.value.push((error as Error).message)
        }
      }
      $q.loading.hide()
    }

    async function signUp() {
      errors.value = []
      if (!check.value) {
        useNotifyError({
          message: t('auth.errors.privacyPolicy', {
            privacy: t('common.privacyPolicy')
          })
        })
        return
      }

      errors.value = []
      newUser.email = newUser.email.toLowerCase()

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...userClean } = newUser

        const data = await signUpMutation({
          input: cleanEmptyValues(userClean)
        })

        const signUp = data?.data.signUp
        if (signUp.error) {
          errors.value.push(signUp.error)
        } else store.setUser(signUp.user)
        registerSuccess.value = true
      } catch (error) {
        errors.value.push((error as Error).message)
      }
      $q.loading.hide()
    }

    function reset() {
      store.toggleRegister(false)
      registerSuccess.value = false
      register.value = false
    }

    onBeforeRouteLeave(() => {
      resetCaches()
    })

    onMounted(() => {
      if (route.query.token) {
        toggleCustomDialog(true)
        LocalStorage.set('token', route.query.token)
      }
    })

    return {
      async onSubmit() {
        console.log('hola')
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
      t,
      extraForm,
      user,
      capitalize,
      toggleCustomDialog,
      reset,
      loginLoading,
      signUpLoading,
      logoutUser,
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      loading,
      check,
      registerSuccess,
      revealPassword,
      register,
      newUser,
      errors,
      userCreedentials,
      store
    }
  }
})
</script>
