<template>
  <q-dialog position="bottom" ref="dialogRef" @hide="onDialogHide">

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
        <q-card-section
          class="text-weight-light knockout text-body1"
          style="letter-spacing: 0.5px"
          :class="!$q.screen.gt.xs ? '' : 'q-py-none'"
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
            <q-list v-for="product in cart" :key="product.cartUid" style="transition-duration: all;">
                <q-item v-if="!step" class="q-my-sm row bg-white">
                  <q-item-section class="col-auto" avatar>
                    <q-avatar color="primary" text-color="white" square>
                      <!-- <img :src="product.urlImage" /> -->
                      <img
                        style="aspect-ratio: 1;"
                        src="../assets/logo.jpg"
                      >
                    </q-avatar>
                      <q-btn
                        @click="selectedFab = product.cartUid"
                        :disabled="selectedFab !== product.cartUid"
                        size="14px"
                        unelevated
                        outline
                        dense
                        rounded
                        padding="0px 10px"
                      >
                          <q-fab
                            v-if="selectedFab === product.cartUid"
                            v-model="fabDelete"
                            label-position="top"
                            flat
                            color="blue-grey-14"
                            padding="5px"
                            icon="mdi-delete"
                          >
                            <q-fab-action
                              outline
                              class="bg-white"
                              @click="deleteProduct(product.cartUid)"
                              icon="mdi-delete"
                            />
                          </q-fab>

                          <!-- Sckeleton -->
                          <q-fab
                            v-else
                            label-position="right"
                            flat
                            outline
                            padding="2px"
                          >
                            <template #icon>
                              <q-icon name="mdi-delete" size="18px" />
                            </template>
                            <q-fab-action
                              class="bg-white"
                              outline
                              @click="deleteProduct(product.cartUid)"
                              icon="mdi-delete"
                            />
                          </q-fab>
                          <!-- <q-icon
                            name="mdi-delete"
                            color="blue-grey-14"
                            size="18px"
                          /> -->
                      </q-btn>
                    <!-- <template v-slot:error>
                      <img src="../assets/logo.jpg" />
                    </template> -->
                  </q-item-section>
                <q-item-section >
                  <q-item-label class="knockout">{{ product.name }}</q-item-label>
                  <q-item-label class="inter text-lowercase text-blue-grey-13" lines="3">
                    <div class="description">{{ product.description }}</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section class="no-padding" style="max-width: 100px;" side>
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
                <q-item
                  v-else-if="step === 1"
                  class="q-my-sm"
                  clickable
                  v-ripple
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
                    <q-item-label caption class="text-dark">{{ product.name }}</q-item-label>
                    <q-item-label class="inter text-lowercase text-blue-grey-13" lines="3">
                      <div class="description">{{ product.accessories ?? product.description }}</div>
                  </q-item-label>
                  </q-item-section>
                  <q-separator vertical />
                  <q-item-section class="text-dark-page" side>
                    <q-item-label caption class="knockout">
                      {{  product.quantity  }} {{ product.quantity > 1 ? 'uds.' : 'ud.' }}
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
              <div class="knockout text-medium" :class="!step ? 'text-h5' : 'text-h4'" style="letter-spacing: -.9px;">
                {{ (isNaN(amount) ? 0 : (!step ? amount : ((amount * 7) / 100) + amount)).toFixed(2).replace('.', ',') }}
                <small>€</small>
              </div>
            </div>
        </q-card-section>

        <!-- </transition-group> -->

        <!-- Step 1 -->

        <q-card-actions class="row q-col-gutter-x-lg  justify-evenly q-px-md q-py-lg">
          <q-btn
            v-if="!step"
            class="col"
            @click="fabDeleteCart = !fabDeleteCart"
            text-color="blue-grey-13"
            :label="!step ? 'Vaciar carrito' : ''"
            no-caps
            :ripple="false"
            flat
          >
            <q-fab
              v-model="fabDeleteCart"
              label-position="top"
              flat
              padding="5px"
              hide-icon
              direction="up"
            >
              <q-fab-action
                @click="fabDeleteCart = !fabDeleteCart"
                outline
                class="bg-white"
                color="bg-light-blue-10"
                icon="mdi-close"
              />
              <q-fab-action
                outline
                class="bg-white"
                @click="deleteCart()"
                color="bg-light-blue-10"
                icon="mdi-delete"
              />
            </q-fab>
          </q-btn>
           <q-btn
              v-else
              icon="mdi-arrow-left"
              flat
              color="blue-grey-13 col"
              @click="step--"
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

      <!-- Fin de la compra -->

      <!-- <q-inner-loading :showing="true" color="warning"> -->
      <q-inner-loading :showing="sendLoading || success" color="warning">
          <q-spinner-gears
            v-if="sendLoading && !success"
            size="100px"
            color="dark"
          />
          <!-- <div v-else-if="!sendLoading && success"> -->
          <q-card v-if="success" class="text-caption q-py-xl">
            <q-card-section class="text-caption text-blue-grey-13 row justify-center">
              ¡Pedido generado con Éxito!
              <q-img
                v-if="invoice"
                width="20px"
                height="20px"
                class="q-ml-xs "
                src="~assets/check.gif"
              />
              <p>Te enviaremos la factura por correo electrónico. ¡Gracias por tu compra!</p>
             <action-button
                @click="success = false; dialogRef.hide()"
                no-caps
                :label="count"
                padding="10px 20px"
                text-color="light-blue-1"
                flat
                class="bg-blue-grey-14 q-mx-auto q-mt-lg"
                rounded
                ripple
              />
            </q-card-section>
            <q-card-actions class="row bg-blue-grey-9 justify-center">
            <banner-install-app class="z-top" />
            </q-card-actions>
          </q-card>
      </q-inner-loading>

      <!-- Fin -->
  </q-dialog>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useDialogPluginComponent } from 'quasar'
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
    cart,
  } = useProductCart()
const { user } = useAuthStore()
const { dialogRef, onDialogHide } = useDialogPluginComponent()

const order = ref(null)
const invoice = ref(null)
const success = ref(false)
const fabDelete = ref(false)
const fabDeleteCart = ref(false)
const step = ref(0)
// const url = process.env.IMAGES_URL
const count = ref(8)

const selectedFab = ref(null)

watchEffect(() => {
  if (count.value === 0) {
    setTimeout(() => {
      dialogRef.value.hide()
      success.value = false;
      count.value = 8;
    }, 400)
  }
})

const TAXES = {
  igic: 'S_IGIC_7',
  iva: 'S_IVA_21',
}


defineEmits([
  // REQUIRED need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])


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

function startCount(countValue) {
  if (countValue >= 0) {
    setTimeout(() => {
      startCount(count.value--);
    }, count.value === 4 ? 1500 : 1000);
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
      sendFacturaDirectaOrder({ orderId: order.value.id, lines: getInvoceItems(order.value?.products)})
        .then((res) => {
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

.product-accesories {
  color: $blue-grey-13;
  font-size: 0.8rem;
  white-space: pre-wrap;
  text-transform: lowercase;
}


.product-accesories::first-letter {
  text-transform: uppercase;
}
.delete-icon {
  position: absolute;
  bottom: 0;
}

.description {
  font-size: 12px;
}
.description::first-letter {
  text-transform: capitalize !important;
}

</style>
