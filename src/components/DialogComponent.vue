<template>
  <q-dialog position="bottom" ref="dialogRef" @hide="onDialogHide">
    <div class="row items-end">
            <q-icon
              v-close-popup
              name="mdi-close"
              class="q-ml-auto"
              color="lime-13"
              size="40px"
            />
          <q-card class="rounded-top full-width">
              <q-card-section
                class="text-weight-light text-subtitle1"
                style="letter-spacing: 0.5px"
              >
                {{ !step ? 'Mi carrito' : 'Resumen' }}
              </q-card-section>
              <q-separator inset />

              <!-- <transition-group
                  appear
                  :enter-active-class="!loading && 'animated fadeOut'"
                > -->

              <q-card-section class="q-py-none q-px-none">
                <transition-group
                    appear
                    :duration="150"
                    leave-active-class="animated fadeOut"
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
                      <q-item-section class="column q-px-none" avatar>
                           <q-img
                            :src="`${url}/productos/${product.imagen}.png`"
                            width="40px"
                            height="50"
                            class="dialog-image"
                          >
                          <template #error>
                              <q-img
                                src="../assets/logo.jpg"
                                fit="scale-down"
                                class="bg-transparent"
                              />
                            </template>
                          </q-img>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-subtitle2">{{ product.name }}</q-item-label>
                        <q-item-label
                          class="inter text-lowercase text-blue-grey-13"
                          lines="3"
                        >
                          <div class="description">{{ product.description }}</div>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section class="no-padding" style="max-width: 100px" side>
                        <q-item-label class="text-body text-blue-grey-13">
                          {{ product.price.toFixed(2).replace('.', ',') }}
                        </q-item-label>
                        <ProductQuantity
                          class="q-pr-none q-ml-auto"
                          @update-item="(e) => updateCartItem(product.cartUid, e)"
                          :product="product"
                          :dense="true"
                        />
                      </q-item-section>
                    </q-item>
                  </q-slide-item>
                  <q-item v-else-if="step === 1" class="q-my-sm" clickable v-ripple>
                    <q-item-section avatar>
                     <q-img
                        :src="`${url}/productos/${product.imagen}.png`"
                        width="40px"
                        height="50"
                        class="dialog-image"
                      >
                      <template #error>
                          <q-img
                            src="../assets/logo.jpg"
                            fit="scale-down"
                            class="bg-transparent"
                          />
                        </template>
                      </q-img>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="text-subtitle2">{{
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
                      <q-item-label caption>
                        {{ product.quantity }}
                        {{ product.quantity > 1 ? 'uds.' : 'ud.' }}
                      </q-item-label>
                      <div>
                        {{ (product.price * product.quantity).toFixed(2).replace('.', ',') }}
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-separator v-if="product.cartUid !== cart.at(-1).cartUid" inset />
                </q-list>
                </transition-group>
              </q-card-section>

              <q-separator class="col-12" size="1px" />
              <q-card-section class="row" @click="deleteCartModel = false">
                <div class="col-12 flex justify-between">
                  <div class="inter text-subtitle2 text-capitalize text-blue-grey-13">
                    Unidades:
                  </div>
                  <div class="text-subtitle1 text-blue-grey-13">
                    {{ cartCount }}
                  </div>
                </div>
                <div class="col-12 flex justify-between">
                  <div class="text-subtitle1">
                      Subtotal
                  </div>
                  <div class="text-subtitle3" style="letter-spacing: -0.9px">
                      {{ amount.toFixed(2).replace('.', ',') }}
                    <small class="text-caption">EUR</small>
                  </div>
                </div>
                <div class="col-12 flex justify-between">
                  <div class="text-h6">
                      TOTAL
                    <span class="text-caption text-dark-page text-capitalize text-bold">
                      (IGIC incluido)
                    </span>
                  </div>
                  <div
                    class="text-medium"
                    :class="!step ? 'text-h5' : 'text-h4'"
                    style="letter-spacing: -0.9px"
                  >
                      {{ ((amount * 7) / 100 + amount).toFixed(2).replace('.', ',') }}
                    <small class="text-caption">EUR</small>
                  </div>
                </div>
              </q-card-section>

              <!-- </transition-group> -->

              <!-- Step 1 -->

              <q-card-actions
                class="q-px-md q-py-lg row justify-between"
              >
               <transition-group
                  v-if="!step"
                  appear
                  enter-active-class="animated flipInX"
               >
                    <q-btn-group
                      v-if="deleteCartModel"
                      outline
                      rounded
                    >
                      <q-btn
                          outline
                          padding="10px 20px"
                          class="delete-icon"
                          @click="deleteCart"
                          color="primary"
                          style="min-width: 129.23px;"
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
                        <!-- <q-btn
                          style="min-width: 50%"
                          padding="10px 20px"
                          color="dark"
                          @click="deleteCartModel = !deleteCartModel"
                          outline
                          rounded
                        /> -->
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
                    v-else
                    @click="step--"
                    icon="mdi-arrow-left"
                    outline
                    rounded
                    padding="10px 29px"
                    label="Atras"
                    no-caps
                    class="col-auto"
                    color="blue-grey-13"
                  />
                <action-button
                  :disable="amount === 0"
                  outline
                  class="col"
                  padding="10px 20px"
                  dense
                  :neutro="!!!step"
                  :label="!step ? 'Continuar' : 'Realizar pedido'"
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
    <q-inner-loading :showing="sendLoading || success" class="bg-transparent">
      <q-spinner-gears
        v-if="sendLoading && !success"
        size="75px"
        color="blue-grey-14 "
      />

        <q-card
          v-if="success"
          class="text-caption rounded-top full-height"
        >
          <q-card-section
            class="text-body2 text-blue-grey-14 row items-center justify-center"
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
              Pronto llegará la factura a tu correo electrónico.
            </p>
            <p class="text-info">
              ¡Gracias por tu
              compra!
            </p>
           <div class="col-12 text-center">
             <action-button
                @click="deleteCart"
                no-caps
                :label="String(count)"
                padding="10px 20px"
                text-color="grey-1"
                flat
                class="bg-blue-grey-14 q-mx-auto q-mt-lg text-body"
                rounded
                ripple
              />
           </div>
            <q-btn
              class="col-12 q-mt-md"
              @click="deleteCart"
              flat
              no-caps
              label="Cerrar"
              rounded
            />
          </q-card-section>
          <banner-install-app v-if="!hideBanner" type="Payment" class="z-top" />
        </q-card>
    </q-inner-loading>

    <!-- Fin -->
  </q-dialog>
</template>

<script setup>
import { ref, watchEffect, onBeforeUnmount } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import ProductQuantity from './ProductQuantity.vue'
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
const { user, hideBanner } = useAuthStore()
const { dialogRef, onDialogHide } = useDialogPluginComponent()
const deleteCartModel = ref(false)
const url = process.env.IMAGES_URL

const order = ref(null)
const invoice = ref(null)

const success = ref(false)
const step = ref(0)
const count = ref(6)

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
      dialogRef.value?.hide()
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
        resetProcess()
        invoice.value = res
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
      dialogRef.value?.hide()
      count.value = 0
      success.value = false
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
.dialog-image {
  width: 60px;
}
</style>
