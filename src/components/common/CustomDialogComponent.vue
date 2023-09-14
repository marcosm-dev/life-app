<template>
  <q-dialog  position="bottom"  ref="dialogRef" class="custom-dialog">
    <div class="row">
        <q-icon
            v-close-popup
            name="mdi-close"
            class="q-ml-auto"
            color="blue-grey-1"
            size="40px"
          />
        <q-card class="border-radius-md bg-grey-1">
          <q-form @submit="onOKClick" class="row">
              <q-card-section class="q-mb-none q-pb-none col-12">
                  <p
                  class="text-h7 q-pa-sm bg-lime-14 q-px-sm border-radius-sm text-grey-10"
                  v-html="$route.query.token ? 'Introduce tu nueva contraseña' : title"
                  />
              </q-card-section>
              <template  v-if="$route.query.token">
                  <q-card-section class="q-pt-none q-px-none col-12">
                  <q-input
                      outlined
                      color="blue-grey-14"
                      clearable
                      item-aligned
                      rounded
                      :type="revealPassword ? 'text' : 'password'"
                      error-message="Por favor, ingresa bien tu contraseña"
                      v-model="reset.password"
                      label="Nueva contraseña"
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
                    outlined
                    color="blue-grey-14"
                    clearable
                    item-aligned
                    rounded
                    :type="revealPassword ? 'text' : 'password'"
                    error-message="Por favor, ingresa bien tu contraseña"
                    v-model="reset.passwordConfirm"
                    label="Repite la nueva contraseña"
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
              </template>
              <template v-else>
                <q-card-section v-if="subtitle || description" class="q-pa-sm q-mx-md text-grey-10">
                  <p v-html="subtitle" />
                  <p v-html="description" />
                </q-card-section>
                <q-card-section class="q-gutter-y-lg col-12 q-pt-none">
                    <q-input
                      v-model="input"
                      outlined
                      rounded
                      color="blue-grey-13"
                      clearable
                      :placeholder="placeHolder"
                      dense
                      :type="dense ? 'text' : 'textarea'"
                    />
                  <p
                      v-if="disclaimer && !success"
                      class="text-bold text-caption border-radius-sm q-pa-md disclaimer"
                      v-html="disclaimer"
                    />
                </q-card-section>
              </template>
              <q-card-actions class="q-px-lg q-pb-lg col-10 q-mx-auto">
                <action-button
                    type="submit"
                    class="full-width"
                    :label="success ? `Cerrar (${count})` : 'Continuar'"
                    :loading="loading"
                  />
              </q-card-actions>
          </q-form>
        </q-card>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDialogPluginComponent, LocalStorage } from 'quasar';
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { Product } from '../models'
import useAuth from 'src/composables/useAuth'
import { useRoute, useRouter } from 'vue-router'

const { user, store } = useAuth()
const { dialogRef } = useDialogPluginComponent()
const route = useRoute()
const router = useRouter()
const revealPassword = ref(false)
const count = ref(5)

const reset = reactive({
  password: '',
  passwordConfirm: ''
})

const props = defineProps({
  placeHolder: {
    type: String,
    default:  'Escribe algo.... (opcional).'
  },
  action: {
    type: String,
    default: 'sendEmail'
  },
  dense: Boolean,
  title: String,
  subtitle: String,
  disclaimer: String,
     product: {
      type: Object as () => Product,
      default: () => ({})
  },
  description: String,
})
const input = ref('')
const loading = ref(false)
const success = ref(false)

const { mutate: sendEmail } = useMutation(gql`
  mutation sendEmail($options: MailOptionsInput!) {
    sendEmail(input: $options)
  }
`)

const { mutate: addToWish } = useMutation(gql`
  mutation addProductToWishes($productId: ID!) {
    addProductToWishes(productId: $productId) {
      id
      name
    }
  }
`)

const { mutate: recoveryPassword } = useMutation(gql`
    mutation recoveryPassword($email: String!) {
      recoveryPassword(email: $email)
    }
`)

const { mutate: updateUser } = useMutation(gql`
    mutation updateUser($input: UserInput!) {
      updateUser(input: $input) {
        id
        name
        lastName
      }
    }
`)

defineEmits([
  // REQUIRED need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const variables = {
  options: {
    subject: 'Solicitud de articulo.',
    to: user.value.email,
    html: `
        <p>
          El usuario ${user.value.name} con email: ${user.value.email} solicita el artículo ${props.product.name} con id: ${props.product.id}
        </p>
        <p>
            ${input.value}
          </p>
        `
  }
}

function startCount(countValue: number) {
  if (!countValue) dialogRef.value?.hide()
  if  (countValue >= 0) {
    setTimeout(() => {
        startCount(count.value--)
      },
      count.value === 4 ? 1500 : 1000
    )
  }
}

async function onOKClick() {
  loading.value = true

  try {
    switch (props.action) {
      case 'sendEmail':
          await sendEmail(variables)
          break;
          case 'recovery':
           if (route.query.token) {
             await updateUser({ input: { password: reset.password} })
            LocalStorage.clear()
            store.$reset()
            router.push('/auth')
            return
          }
            await recoveryPassword({ email: input.value })

            break;
            case 'add-to-with':
              await addToWish({ productId: props.product.id })
              await sendEmail(variables)
        break;
        default:
          break;
  }
  } catch (error) {
  } finally {
    startCount(count.value)
    success.value = true
    loading.value = false
  }

}
</script>

<style lang="scss" >
.disclaimer {
  border: 2px solid $lime-14;
}
.custom-dialog .q-dialog__backdrop {
  background: rgba($color: #000000, $alpha: .8);
}
</style>
