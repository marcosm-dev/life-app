<template>
  <q-dialog position="bottom" ref="dialogRef" >
    <div class="row">
        <q-icon
          v-close-popup
          name="mdi-close"
          class="q-ml-auto"
          color="blue-grey-1"
          size="40px"
        />
        <q-card class="border-radius-md bg-grey-1 col-12">
            <q-card-section class="col-12 text-body2 text-weight-bold text-grey-10 q-pb-none">
                <p
                  v-html="title"
                />
                <q-separator spaced="10px" />
            </q-card-section>
            <q-card-section v-if="success" class="row text-center">
              <div class="col-12 q-mb-lg q-gutter-y-md">
                <q-img
                  width="60px"
                  height="60px"
                  class="q-ml-xs"
                  src="~assets/check.gif"
                />
                <p class="text-body2">
                  {{ successMessage }}
                </p>
              </div>
              <action-button
                class="col-12"
                neutro
                :label="$q.lang.label.close"
              />
            </q-card-section>
            <q-form v-else @submit="onOKClick">
                <template v-if="type === 'password'">
                    <change-password
                      :type="type"
                      v-model:password="reset.password"
                      v-model:oldPassword="reset.oldPassword"
                    />
                </template>
                <template v-else-if="!success">
                  <q-card-section v-if="subtitle || description" class="text-grey-10 q-py-xs q-px-lg">
                    <p
                      class="text-body2 border-radius-sm text-grey-10 subtitle"
                      v-html="subtitle"
                    />
                    <p class="text-caption text-red-12 text-weight-bold">
                      * {{ description }}
                    </p>
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
                  </q-card-section>
                </template>
                <q-card-actions class="q-pa-md q-gutter-y-md col-12">
                  <p
                    v-if="disclaimer && success"
                    class="text-caption border-radius-sm q-pa-md disclaimer"
                    v-html="disclaimer"
                  />
                    <action-button
                        type="submit"
                        class="full-width"
                        neutro
                        :label="type === 'password' ? $t('common.save') : $t('common.continue')"
                        :loading="loading"
                    >
                      <template #icon>
                          <q-img
                              v-if="success"
                              width="20px"
                              height="20px"
                              class="q-ml-xs"
                              src="~assets/check.gif"
                          />
                      </template>
                    </action-button>
                </q-card-actions>
            </q-form>
        </q-card>
    </div>
  </q-dialog>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useDialogPluginComponent, LocalStorage } from 'quasar'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { Product } from '../models';
import useAuth from 'src/composables/useAuth'
import { useRoute, useRouter } from 'vue-router'
import ChangePassword from '../ChangePassword.vue'

const { user, store } = useAuth()
const { dialogRef } = useDialogPluginComponent()
const route = useRoute()
const router = useRouter()
const count = ref(5)
const input = ref('')
const loading = ref(false)
const success = ref(false)

const reset = reactive({
  password: '',
  oldPassword: ''
})

const props = defineProps({
  successTitle: String,
  placeHolder: {
    type: String,
    default:  'Escribe algo.... (opcional).'
  },
  action: {
    type: String,
    default: 'sendEmail'
  },
  type: {
    type: String,
    default: 'custom'
  },
  dense: Boolean,
  title: String,
  subtitle: String,
  disclaimer: String,
  successMessage: {
    type: String,
    default: 'Todo ha ido bien'
  },
  product: {
    type: Object as () => Product,
    default: () => ({})
  },
  description: String,
})

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

const { mutate: resetPassword } = useMutation(gql`
    mutation resetPassword($input:  ResetPasswordInput!) {
      resetPassword(input: $input) {
        token
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

const variables: any = {
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
  if (countValue === 0) return dialogRef.value?.hide()
  if  (countValue >= 0) {
    setTimeout(() => {
        startCount(count.value--)
      },
      1000
    )
  }
}

async function onOKClick() {
  if (success.value) {
    dialogRef.value?.hide()
    return
  }
  loading.value = true

  try {
    switch (props.action) {
      case 'sendEmail':
          await sendEmail(variables)
      break;
      case 'recovery':
        if (route.query.token) {
          await resetPassword({ input: { password: reset.password, token: route.query.token } })
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
      case 'update':
          await updateUser({ input: reset })
      break;
        default:
      break;
  }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    success.value = true
    startCount(count.value)
  }

}
</script>

<style lang="scss" scoped>
.custom-dialog .q-dialog__backdrop {
  background: rgba($color: #000000, $alpha: .7);
}
.custom-dialog .disclaimer {
  border-color: $lime-14;
  border-style: dashed solid none;
}
</style>
