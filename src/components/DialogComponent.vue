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
        <q-card-section class="text-weight-light knockout text-body" style="letter-spacing: 0.5px">
          {{ !step ? 'MI CARRITO' : 'RESUMEN DE TU PEDIDO:' }}
        </q-card-section>
        <q-separator inset />


        <transition-group
          appear
          :enter-active-class="!loading && 'animated fadeOut'"
        >

        <q-card-section class="no-padding">
          <q-list v-for="product in products" :key="product.id">
              <q-item v-if="!step" class="q-my-sm row" >
                <q-item-section class="col-auto" avatar>
                  <q-avatar color="primary" text-color="white" square>
                    <!-- <img :src="product.urlImage" /> -->
                    <img
                      style="aspect-ratio: 1;"
                      src="../assets/logo.jpg"
                    >
                  </q-avatar>
                    <q-btn
                      @click="deleteProduct(product.cartUid)"
                      size="14px"
                      stretch
                      unelevated
                      dense
                      color="blue-grey-2"
                      outline
                      rounded
                    >
                        <q-icon
                          name="mdi-delete"
                          color="blue-grey-14"
                          size="20px"
                        />
                    </q-btn>
                  <!-- <template v-slot:error>
                    <img src="../assets/logo.jpg" />
                  </template> -->
                </q-item-section>
              <q-item-section >
                <q-item-label>{{ product.name }}</q-item-label>
                <q-item-label caption class="text-h6" lines="2">
                  {{ product.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-body knockout text-blue-grey-13">
                  {{ product.price.toFixed(2) }}<small>€</small>
                </q-item-label>
                <ProductQuantity
                  class="q-px-none"
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
                  <q-item-label caption class="text-h6" lines="1">
                    {{ product.accessories }}
                  </q-item-label>
                </q-item-section>
                <q-separator vertical />
                <q-item-section class="text-dark-page" side>
                  <q-item-label caption>
                    {{ product.quantity }} uds.
                  </q-item-label>
                  <div class="knockout">
                    {{ (product.price * product.quantity).toFixed(2) }}
                  </div>
                </q-item-section>
              </q-item>
            <q-separator v-if="product.cartUid !== products.at(-1).cartUid" inset />
          </q-list>
        </q-card-section>

        <q-separator class="col-12" size="1px" />
        <q-card-section class="row text-h6">
            <div class="col-12 flex justify-between">
              <div class="knockout text-subtitle1 text-capitalize text-blue-grey-13">
                Unidades:
              </div>
              <div class="knockout text-subtitle1 text-blue-grey-13">
                {{ cartCount }}
              </div>
            </div>
            <div class="col-12 flex justify-between">
              <div class="text-subtitle1 knockout">
                {{ !step ? 'Subtotal:' : 'TOTAL:' }}
                <span
                  v-if="step === 1"
                  class="text-caption text-capitalize text-blue-grey-13"
                >
                  (Impuestos incluidos)
              </span>
              </div>
              <div class="knockout text-medium" :class="!step ? 'text-h5' : 'text-h4'">
                {{ (isNaN(amount) ? 0 : (!step ? amount : ((amount * 7) / 100) + amount)).toFixed(2).replace('.', ',') }}
                <small>€</small>
              </div>
            </div>
        </q-card-section>

        </transition-group>

        <q-card-actions class="row q-col-gutter-x-lg  justify-evenly q-px-md q-py-lg">
          <q-btn
            class="col"
            :text-color="step ? 'blue-grey-13' : 'blue-grey-14'"
            :label="!step && 'Vaciar carrito'"
            :icon="step === 1 && 'mdi-arrow-left'"
            @click="!step ? deleteCart() : step--"
            no-caps
            flat
          />
          <q-btn
            :disable="amount === 0"
            outline
            square
            class="text-bold text-body col"
            padding="10px 20px"
            dense
            :color="!step ? 'light-blue-9' : 'blue-grey-13'"
            :label="!step ? 'Ver resumen' : 'Realizar pedido'"
            @click="onOKClick"
            no-caps
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
      <q-inner-loading :showing="sendLoading || success" color="warning">
          <q-spinner-gears
            v-if="sendLoading && !success"
            size="100px"
            color="dark"
          />
          <div v-else-if="!sendLoading && success">
            <q-img
              v-if="!invoice"
              width="120px"
              height="120px"
              :src="`${url}/check.webp`"
            />
            <q-btn
              v-else
              @click="success = false; dialogRef.hide()"
              no-caps
              padding="10px 20px"
              text-color="positive"
              style="background: rgb(0,0,0,.3)"
              flat
              square
              ripple
            >
                <div class="text-body1 knockout">
                    {{ $q.lang.label.close }}
                    <div class="text-body text-dark-page knockout" style="color: rgb(255,255,255,.75)">
                        {{ count }}
                    </div>
                </div>
            </q-btn>
          </div>
      </q-inner-loading>
  </q-dialog>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useDialogPluginComponent } from 'quasar'
import ProductQuantity from './ProductQuantity.vue'
import useProductCart from 'src/composables/useProductCart'
import { useMutation } from '@vue/apollo-composable'
import { useAuthStore } from '../stores/auth';
import gql from 'graphql-tag';
const {
    updateCartItem,
    amount,
    resetCart,
    deleteProduct,
    cartIds,
    cartCount
  } = useProductCart()
const { user } = useAuthStore()
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const order = ref(null)
const invoice = ref(null)
const success = ref(false)
const step = ref(0)
const url = process.env.IMAGES_URL
const count = ref(4)
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

watchEffect(() => {
  if (count.value === 0) {
    setTimeout(() => {
      dialogRef.value.hide()
      success.value = false;
      count.value = 4;
    }, 500)
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
    resetCart()
    order.value = null
    step.value = null

    startCount(count.value)
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
          console.log(res)
          success.value = true
          setTimeout(() => {
            resetProcess()
            invoice.value = res
          }, 2750)
        })
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

.mdi-cube-send  {
  margin-left: 16px !important;
}
</style>
