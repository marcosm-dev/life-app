<template>
  <q-dialog position="bottom" ref="dialogRef" @hide="onDialogHide">
    <div v-if="!step">
      <q-icon
        v-if="$q.screen.width <= 600"
        v-close-popup
        class="close-icon"
        name="mdi-close"
        color="white"
        size="40px"
      />
      <q-card class="full-width">
        <q-icon
          v-if="$q.screen.width >= 600"
          v-close-popup
          name="mdi-close"
          color="dark block q-ml-auto"
          size="40px"
        />
        <q-card-section class="text-weight-bold knockout text-body1" style="letter-spacing: 0.5px">
          TU PEDIDO EN CURSO:
        </q-card-section>
        <q-separator inset />

        <q-card-section class="no-padding">
          <q-list v-for="product in cart" :key="product.id">
            <q-item
              v-if="cart.some(p => p.uuid === product.uuid)"
              class="q-my-sm"
              style="border-bottom: 1px inset #e5e9eb"
            >
              <q-item-section  avatar>
                <q-avatar color="primary" text-color="white" square>
                  <!-- <img :src="product.urlImage" /> -->
                  <img
                    style="aspect-ratio: 1;"
                    src="../assets/logo.jpg"
                  >
                </q-avatar>
                  <q-btn
                    @click="deleteProduct(product.cartUid)"
                    square
                    size="14px"
                    stretch
                    unelevated
                    dense
                    color="negative"
                    outline
                  >
                      <q-icon
                        name="mdi-delete"
                        color="negative"
                        size="20px"
                      />
                  </q-btn>
                <!-- <template v-slot:error>
                  <img src="../assets/logo.jpg" />
                </template> -->
              </q-item-section>
              <q-item-section>
                <q-separator
                  v-if="product.quantity === 0"
                  class="delete-seperator"
                  size="2px"
                  color="negative"
                />
                <q-item-label>{{ product.name }}</q-item-label>
                <q-item-label caption lines="1">
                  {{ product.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <ProductQuantity
                  @update-item="(e) => updateCartItem(product.cartUid, e)"
                  :product="product"
                  :dense="true"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section class="text-right">
          <div class="text-h5 row jusify-evenlys">
            <div class="knockout col-auto">SUBTOTAL: </div>
            <div class="knockout col">{{ isNaN(amount) ? 0 : amount}} €</div>
          </div>
        </q-card-section>

        <!-- buttons example -->
        <q-card-actions class="right row">
          <q-btn
            color="primary col text-bold text-negative text-body1"
            label="Borrar pedido"
            @click="deleteCart"
            no-caps
            flat
          />
          <q-btn
            :disable="amount === 0"
            color="primary text-bold text-body1 col"
            label="Ver resumen"
            @click="onOKClick"
            no-caps
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </div>
    <div v-else-if="step === 1">
      <q-icon
        v-if="$q.screen.width <= 600"
        v-close-popup
        class="close-icon"
        name="mdi-close"
        color="white"
        size="40px"
      />
      <q-card class="full-width">
        <q-icon
          v-if="$q.screen.width >= 600"
          v-close-popup
          name="mdi-close"
          color="dark block q-ml-auto"
          size="40px"
        />
        <q-card-section class="text-weight-bold knockout text-body1" style="letter-spacing: 0.5px">
          RESUMEN DE TU PEDIDO:
        </q-card-section>
        <q-separator inset />

        <q-card-section class="no-padding">
          <q-list v-for="product in props.products" :key="product.id">
            <q-item
              v-if="cart.some(p => p.uuid === product.uuid)"
              class="q-my-sm"
              clickable
              v-ripple
              style="border-bottom: 1px inset #e5e9eb"
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" square>
                  <!-- <img :src="product.urlImage" /> -->
                  <img src="../assets/logo.jpg" />
                </q-avatar>
                <!-- <template v-slot:error>
                  <img src="../assets/logo.jpg" />
                </template> -->
              </q-item-section>
              <q-item-section>
                <q-separator
                  v-if="product.quantity === 0"
                  class="delete-seperator"
                  size="2px"
                  color="negative"
                />
                <q-item-label caption class="text-dark">{{ product.name }}</q-item-label>
                <q-item-label class="product-description" lines="1">
                  {{ product.description }}
                </q-item-label>
              </q-item-section>
              <q-separator vertical />
              <q-item-section class="text-dark-page" side>
                {{ product.quantity }} uds.
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section class="text-right">
          <div class="text-h5 row jusify-evenly">
            <div class="knockout col-auto">TOTAL:</div>
            <div class="knockout col">
              {{ ((amount * 7) / 100) + amount }} €
            </div>
            <div class="col-12">
              <div
                class="text-dark-page col-12 text-lowercase"
                style="font-size: 10px; line-height: 1.5; color: rgb(0, 0, 0, 0.8)"
              >
                igic incluido
              </div>
              <q-separator />
            </div>
          </div>
        </q-card-section>

        <!-- buttons example -->
        <q-card-actions class="right row">
          <q-btn
            color="warning col text-bold text-body1"
            label="Seguir comprando"
            @click="step = null; igic = false"
            no-caps
            flat
          />
          <q-btn
            :disable="amount === 0"
            color="secondary text-bold text-body1 col"
            label="Generar pedido"
            @click="onOKClick"
            no-caps
            :loading="sendLoading"
          />
          <q-inner-loading :showing="sendLoading || success" color="warning">
              <q-spinner-gears
                v-if="!success"
                size="100px"
                color="dark"
              />
              <q-img
                v-else
                width="120px"
                height="120px"
                :src="`${url}/check.webp`"
              />
            </q-inner-loading>
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import ProductQuantity from './ProductQuantity.vue'
import useProductCart from 'src/composables/useProductCart'
import { useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '../stores/auth';
import gql from 'graphql-tag';
const order = ref(null)
const success = ref(false)

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})
const igic = ref(false)
const step = ref(null)
const url = process.env.IMAGES_URL

const TAXES = {
  igic: 'S_IGIC_7',
  iva: 'S_IVA_21',
}


defineEmits([
  // REQUIRED need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])

const {
    updateCartItem,
    cart,
    amount,
    resetCart,
    deleteProduct,
    cartIds
  } = useProductCart()
const { user } = useAuthStore()
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()


const { mutate: createOrder, loading } = useMutation(gql`
  mutation createOrder($products: [ID!]!, $userId: ID!) {
    createOrder(input: {
      userId: $userId
      products: $products
    }) {
      id
      amount
      products {
        amount
        quantity
        product {
          id
          uuid
          price
          description
        }
      }
      status
    }
  }
`)

const { mutate: sendFacturaDirectaOrder, loading: sendLoading } = useMutation(gql`
  mutation sendFacturaDirectaOrder($lines: [OrderLines!]!, $orderId: ID!) {
    sendFacturaDirectaOrder(input: {
      orderId: $orderId
      lines: $lines
    })
  }
`)

function resetProcess() {
    resetCart()
    dialogRef.value.hide()
    order.value = null
    success.value = false
    step.value = null
}

const getInvoceItems = products => {
    return products.map((item) => {
        const line = {
            account: '700000',
            document: item.product.uuid,
            quantity: item.quantity,
            unitPrice: item.product.price,
            text: item.product.description,
            tax: [TAXES['igic']],
        }
        return line
  })
}
// this is part of our example (so not required)
async function onOKClick() {
  try {
    if (!step.value) {
     const { data } = await createOrder({ userId: user.id, products: cartIds.value })
     order.value = data.createOrder
     step.value = 1

    } else if (step.value === 1) {
      const { data } = await sendFacturaDirectaOrder({ orderId: order.value.id, lines: getInvoceItems(order.value?.products)})
      success.value = true
      setTimeout(() => {
        resetProcess()
      }, 2000)
    }

  } catch (error) {
    console.log(error)
  }
}

function deleteCart() {
  resetCart()
  setTimeout(() => {
    dialogRef.value.hide()
  }, 500)
}

</script>

<style lang="scss" scoped>
.close-icon {
  position: absolute;
  right: 0;
  top: -40px;
}
.delete-seperator {
  position: relative;
  width: 150px;
  top: 15px;
  transform: rotate(-25deg);
}
.product-description {
  color: $primary;
  font-size: 0.8rem;
  white-space: pre-wrap;
  text-transform: lowercase;
}

.product-description::first-letter {
  text-transform: uppercase;
}
.delete-icon {
  position: absolute;
  bottom: 0;
}
</style>
