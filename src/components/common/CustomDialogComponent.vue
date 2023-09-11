<template>
  <q-dialog  position="bottom"  ref="dialogRef">
      <div class="row">
            <q-card class="border-radius-md">
                <q-card-section>
                    <p class="text-subtitle1 q-px-sm" v-html="title" />
                    <p class="text- q-px-sm  q-py-none text-blue-grey-14" v-html="subtitle" />
                </q-card-section>
                <q-card-section>
                <q-input
                    v-model="message"
                    outlined
                    rounded
                    color="blue-grey-13"
                    clearable
                    :placeholder="placeHolder"
                    dense
                    type="textarea"
                  />
                </q-card-section>
                <q-card-actions class="q-px-lg q-pb-lg">
                  <action-button
                      @click="onOKClick"
                      class="full-width"
                      label="Enviar"
                      :loading="loading || wishLoading"
                    />
                </q-card-actions>
            </q-card>
      </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { Product } from '../models'
import useAuth from 'src/composables/useAuth'

const { user } = useAuth()
const { dialogRef } = useDialogPluginComponent()
const props = defineProps({
  title: String,
  subtitle: String,
     product: {
      type: Object as () => Product,
      default: () => ({})
  },
})
const message = ref('')
const placeHolder = 'Escribe algo.... (opcional).'

const { mutate: sendEmail, loading } = useMutation(gql`
  mutation sendEmail($options: MailOptionsInput!) {
    sendEmail(input: $options)
  }
`)

const { mutate: addToWish, loading: wishLoading } = useMutation(gql`
  mutation addProductToWishes($productId: ID!) {
    addProductToWishes(productId: $productId) {
      id
      name
    }
  }
`)

defineEmits([
  // REQUIRED need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

async function onOKClick() {
  const variables = {
    options:  {
      subject: 'Solicitud de articulo.',
      to: user.value.email,
      html: `
          <p>
            El usuario ${user.value.name} con email: ${user.value.email} solicita el artículo ${props.product.name} con id: ${props.product.id}
          </p>
          <p>
              ${message.value}
            </p>
          `
    }
  }
  await sendEmail(variables)
  await addToWish({ productId: props.product.id})
  dialogRef.value?.hide()
}


</script>
