<template>
  <q-dialog position="bottom" ref="dialogRef" @hide="onDialogHide">
    <div class="column items-end">
          <q-icon
            v-close-popup
            name="mdi-close"
            class="q-ml-auto"
            color="white"
            size="40px"
          />
          <q-card class="rounded-top full-width">
              <q-card-section
                class="text-weight-light knockout text-body1"
                style="letter-spacing: 0.5px"
              >
                {{ !step ? 'Mi carrito' : 'Resumen' }}
              </q-card-section>
              <q-separator inset />

              <!-- <transition-group
                  appear
                  :enter-active-class="!loading && 'animated fadeOut'"
                > -->

              <q-card-section class="q-py-none q-pl-none">
                <transition-group
                    appear
                    :duration="150"
                    leave-active-class="animated slideOutDown"
                  >
                <q-list
                  v-for="product in cart"
                  :key="product.cartUid"
                  style="transition-duration: all"
                >
                  <q-slide-item
                    v-if="!step"
                    left-color="red-14"
                    @left="onLeft(product.cartUid)"
                    @right="onRight"
                  >
                    <template v-slot:left>
                      <q-icon name="mdi-delete" color="light-blue-1" />
                      Borrar
                    </template>
                    <q-item v-if="!step" class="row bg-white">
                      <q-item-section class="column" avatar>
                        <q-avatar color="primary" text-color="white" square>
                          <!-- <img :src="product.urlImage" /> -->
                          <img style="aspect-ratio: 1" src="../assets/logo.jpg" />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="knockout">{{ product.name }}</q-item-label>
                        <q-item-label
                          class="inter text-lowercase text-blue-grey-13"
                          lines="3"
                        >
                          <div class="description">{{ product.description }}</div>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section class="no-padding" style="max-width: 100px" side>
                        <q-item-label class="text-body knockout text-blue-grey-13">
                          {{ product.price.toFixed(2) }}
                        </q-item-label>
                        <ProductQuantity
                          class="q-pr-none"
                          @update-item="(e) => updateCartItem(product.cartUid, e)"
                          :product="product"
                          :dense="true"
                        />
                      </q-item-section>
                    </q-item>
                  </q-slide-item>
                  <q-item v-else-if="step === 1" class="q-my-sm" clickable v-ripple>
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
                      <q-item-label caption class="text-dark">{{
                        product.name
                      }}</q-item-label>
                      <q-item-label
                        class="inter text-lowercase text-blue-grey-13"
                        lines="3"
                      >
                        <div class="description">
                          {{ product.accessories ?? product.description }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                    <q-separator vertical />
                    <q-item-section class="text-dark-page" side>
                      <q-item-label caption class="knockout">
                        {{ product.quantity }}
                        {{ product.quantity > 1 ? 'uds.' : 'ud.' }}
                      </q-item-label>
                      <div class="knockout">
                        {{ (product.price * product.quantity).toFixed(2) }}
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="product.cartUid !== cart.at(-1).cartUid" inset />
                </q-list>
                </transition-group>
              </q-card-section>

              <q-separator class="col-12" size="1px" />
              <q-card-section class="row text-h6">
                <div class="col-12 flex justify-between">
                  <div class="inter text-subtitle2 text-capitalize text-blue-grey-13">
                    Unidades:
                  </div>
                  <div class="knockout text-subtitle1 text-blue-grey-13">
                    {{ cartCount }}
                  </div>
                </div>
                <div class="col-12 flex justify-between">
                  <div class="knockout">
                    {{ !step ? 'Subtotal:' : 'TOTAL:' }}
                    <span
                      v-if="step === 1"
                      class="text-caption text-capitalize text-blue-grey-13"
                    >
                      (Impuestos incluidos)
                    </span>
                  </div>
                  <div
                    class="knockout text-medium"
                    :class="!step ? 'text-h5' : 'text-h4'"
                    style="letter-spacing: -0.9px"
                  >
                    {{
                      (isNaN(amount) ? 0 : !step ? amount : (amount * 7) / 100 + amount)
                        .toFixed(2)
                        .replace('.', ',')
                    }}
                    <small>€</small>
                  </div>
                </div>
              </q-card-section>

              <!-- </transition-group> -->

              <!-- Step 1 -->

              <q-card-actions
                class="row justify-evenly q-px-md q-py-lg"
              >
               <transition-group
                  v-if="!step"
                  appear
                  enter-active-class="animated flipInX"
               >
                    <q-btn-group v-if="deleteCartModel" outline rounded>
                      <q-btn
                          outline
                          padding="10px 20px"
                          class="delete-icon"
                          @click="deleteCart"
                          style="min-width: 50%"
                          color="primary"
                          rounded
                        >
                          <q-spinner
                             v-if="removeLoading"
                             size="24px"
                           />
                          <q-icon
                            v-else
                            size="24px"
                            name="mdi-delete-outline"
                          />
                        </q-btn>
                        <q-btn
                          style="min-width: 50%"
                          padding="10px 20px"
                          icon="mdi-close"
                          color="dark"
                          @click="deleteCartModel = !deleteCartModel"
                          outline
                          rounded
                        />
                    </q-btn-group>
                      <q-btn
                        v-else-if="!step && !deleteCartModel"
                        class="col-auto"
                        rounded
                        color="dark"
                        no-caps
                        outline
                        @click="deleteCartModel = !deleteCartModel"
                        :label="!step ? 'Vaciar carrito' : ''"
                        padding="10px 20px"
                        :ripple="false"
                      />
               </transition-group>
                <q-btn
                    @click="step--"
                    icon="mdi-arrow-left"
                    outline
                    rounded
                    align="start"
                    padding="10px 20px"
                    label="Atras"
                    no-caps
                    class="col q-ml-lg"
                    color="blue-grey-13"
                  />

                <action-button
                  :disable="amount === 0"
                  outline
                  class="col"
                  padding="10px 20px"
                  dense
                  :neutro="!!!step"
                  :label="!step ? 'Guardar y ver resumen' : 'Realizar pedido'"
                  @click="onOKClick"
                  no-caps
                  :loading="loading"
                />
              </q-card-actions>

            <!-- Fin -->
          </q-card>
    </div>
    <!-- Fin de la compra -->

    <!-- <q-inner-loading :showing="true" color="warning"> -->
    <q-inner-loading :showing="sendLoading || success" color="warning">
      <q-spinner-gears
        v-if="sendLoading && !success"
        size="75px"
        color="blue-grey-14"
      />
      <!-- <div v-else-if="!sendLoading && success"> -->
      <q-card
        v-if="success"
        class="text-caption q-py-xl rounded-top bg-light-blue-1 dialog-card"
      >
        <q-card-section
          class="text-caption text-blue-grey-14 row justify-center"
        >
          ¡Tu pedido se ha generado con Éxito!
          <q-img
            v-if="invoice"
            width="20px"
            height="20px"
            class="q-ml-xs"
            src="~assets/check.gif"
          />
          <p class="text-blue-grey-13">
            Le enviaremos la factura por correo electrónico. ¡Gracias por tu
            compra!
          </p>
          <action-button
            @click="success = false ;dialogRef.hide()"
            no-caps
            :label="String(count)"
            padding="10px 20px"
            text-color="light-blue-1"
            flat
            class="bg-blue-grey-14 q-mx-auto q-mt-lg text-caption"
            rounded
            ripple
          />
          <q-btn
            class="col-12 q-mt-md"
            @click="dialogRef.hide()"
            flat
            no-caps
            label="Cerrar"
            rounded
          />
        </q-card-section>
        <banner-install-app type="Payment" class="z-top" />
      </q-card>
    </q-inner-loading>

    <!-- Fin -->
  </q-dialog>
</template>

<script setup>
import { ref, watchEffect, onBeforeUnmount } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import ProductQuantity from './ProductQuantity.vue'
import useCartDialog from 'src/composables/useCartDialog'
import useProductCart from 'src/composables/useProductCart'
import { useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '../stores/auth'
import gql from 'graphql-tag'
const {
  updateCartItem,
  amount,
  resetCart,
  deleteProduct,
  cartIds,
  cartCount,
  cart
} = useProductCart()
const { user } = useAuthStore()
const { dialogRef, onDialogHide } = useDialogPluginComponent()
const { toggleCartDialog } = useCartDialog(dialogRef.value?.$el)
const deleteCartModel = ref(false)

const order = ref(null)
const invoice = ref(null)
const success = ref(false)
const fabDeleteCart = ref(false)
const step = ref(0)
// const url = process.env.IMAGES_URL
const count = ref(8)

const $q = useQuasar()
let timer

function finalize(reset) {
  timer = setTimeout(() => {
    reset()
  }, 200)
}

onBeforeUnmount(() => {
  clearTimeout(timer)
})

function onLeft(uuid) {
  deleteProduct(uuid)
  $q.notify('Producto eliminado del carrito')
  finalize(reset)
}

function onRight({ reset }) {
  $q.notify('Right action triggered. Resetting in 1 second.')
  finalize(reset)
}

watchEffect(() => {
  if (count.value === 0) {
    setTimeout(() => {
      dialogRef.value.hide()
      success.value = false
      count.value = 8
    }, 400)
  }
})

const TAXES = {
  igic: 'S_IGIC_7',
  iva: 'S_IVA_21'
}

defineEmits([
  // REQUIRED need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const { mutate: createOrder, loading } = useMutation(gql`
  mutation createOrder($products: [ID!]!, $userId: ID!) {
    createOrder(input: { userId: $userId, products: $products }) {
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

const { mutate: sendFacturaDirectaOrder, loading: sendLoading } =
  useMutation(gql`
    mutation sendFacturaDirectaOrder($lines: [OrderLines!]!, $orderId: ID!) {
      sendFacturaDirectaOrder(input: { orderId: $orderId, lines: $lines })
    }
  `)

  const { mutate: removeOrder, loading: removeLoading  } = useMutation(gql`
      mutation removeOrderById($orderId: ID!) {
        removeOrderById(orderId: $orderId)
      }
  `, () => ({
    variables: {
      orderId: order.value.id
    }
  }))

function startCount(countValue) {
  if (countValue >= 0) {
    setTimeout(
      () => {
        startCount(count.value--)
      },
      count.value === 4 ? 1500 : 1000
    )
  }
}

function resetProcess() {
  order.value = null
  step.value = null

  startCount(count.value)

  setTimeout(() => {
    resetCart()
  }, 9000)
}

const getInvoceItems = (products) => {
  return products.map((item) => {
    const line = {
      account: '700000',
      document: `pro_${item.product.uuid}`,
      quantity: item.quantity,
      unitPrice: item.product.price,
      text: item.product.description,
      tax: [TAXES['igic']]
    }
    return line
  })
}

async function onOKClick() {
  try {
    if (!step.value) {
      const { data } = await createOrder({
        userId: user.id,
        products: cartIds.value
      })
      order.value = data.createOrder
      step.value = 1
    } else if (step.value === 1) {
      sendFacturaDirectaOrder({
        orderId: order.value.id,
        lines: getInvoceItems(order.value?.products)
      }).then((res) => {
        success.value = true
        setTimeout(() => {
          resetProcess()
          invoice.value = res
        }, 2750)
      })
    }
  } catch (error) {
    setTimeout(() => {
      resetProcess()
      invoice.value = res
    }, 2750)
  }
}

async function deleteCart() {
   if (order.value) await removeOrder()
    setTimeout(() => {
      dialogRef.value.hide()
      resetCart()
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

.product-accesories {
  color: $blue-grey-13;
  font-size: 0.8rem;
  white-space: pre-wrap;
  text-transform: lowercase;
}

.product-accesories::first-letter {
  text-transform: uppercase;
}
.mdi-delete-outline {
  color: $accent !important;
}

.description {
  font-size: 12px;
}
.description::first-letter {
  text-transform: capitalize !important;
}

.dialog-card {
  border: 1px solid rgba($color: $dark-page, $alpha: 0.5);
}
</style>
