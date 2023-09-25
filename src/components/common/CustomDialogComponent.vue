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
        <q-card class="border-radius-md bg-grey-1 col-12">
          <q-card-section class="q-mb-none q-pb-none col-12">
              <p
                v-if="success"
                class="text-body2 q-pa-sm bg-dark-page  q-px-sm border-radius-sm text-grey-2"
              >
                {{ successTitle ? successTitle : $t('recovery.success.title') }}:
              </p>
              <p
                v-else
                class="text-body2 q-pa-sm bg-dark-page  q-px-sm border-radius-sm text-grey-2"
                v-html="$route.query.token ? $t('dialogs.recovery.title') : title"
              />
          </q-card-section>
          <q-form  @submit="onOKClick" class="row">
              <template  v-if="$route.query.token || type === 'password'">
                  <change-password
                    :type="type"
                    v-model:password="reset.password"
                    v-model:oldPassword="reset.oldPassword"
                  />
              </template>
              <template v-else-if="!success">
                <q-card-section v-if="subtitle || description" class="text-grey-10 q-py-none q-px-lg">
                  <p
                    class="text-body2 border-radius-sm text-grey-8 subtitle"
                    v-html="subtitle"
                   />
                  <p class="text-caption" v-html="description" />
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
                      :label="success ? `Cerrar (${count})` : type === 'password' ? $t('common.save') : $t('common.continue')"
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
import { Product } from '../models'
import useAuth from 'src/composables/useAuth'
import { useRoute, useRouter } from 'vue-router'
import ChangePassword from '../ChangePassword.vue'

const { user, store } = useAuth()
const { dialogRef } = useDialogPluginComponent()
const route = useRoute()
const router = useRouter()
const count = ref(5)

const reset = reactive({
  oldPassword: '',
  password: '',
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
  type: String,
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
          await updateUser({ input: { password: reset.password, oldPassword: reset.oldPassword } })
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
