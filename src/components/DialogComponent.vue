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
                <q-item-label>{{ product.name }}</q-item-label>
                <q-item-label caption lines="1">
                  {{ product.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <ProductQuantity
                  @update-product="(e) => updateProductInStore(product, e)"
                  :quantity="product.quantity"
                  :price="product.price"
                  :dense="true"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section class="text-right">
          <div class="text-h5 row jusify-evenly">
            <div class="knockout col-auto">TOTAL:</div>
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
              {{ igic ? finalPrice() : isNaN(amount) ? 0 : amount}} €
            </div>
            <div class="col-12">
              <div
                class="text-dark-page col-12 text-lowercase"
                style="font-size: 10px; line-height: 1.5; color: rgb(0, 0, 0, 0.8)"
              >
                sin igic
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
          />
          <q-inner-loading :showing="visible" color="warning">
            <q-spinner-gears
              v-if="!showSimulatedReturnData"
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

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})
const igic = ref(false)
const step = ref(1)
const loading = ref(false)
const url = process.env.IMAGES_URL
  const TAXES = {
    igic: 7,
    iva: 21,
  }

defineEmits([
  // REQUIRED need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
])

const { addOrUpdateProduct, updateCart, cart, amount, resetCart } = useProductCart()
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

function updateProductInStore(product, action) {
  if (product.quantity !== 0) {
    const quantity = action === '-' ? (product.quantity -= 1) : (product.quantity += 1)
    addOrUpdateProduct({ ...product, quantity })
  } else {
    if (action === '+') {
      addOrUpdateProduct({ ...product, quantity: 1 })
    } else {
      const products = cart.value.filter(p => p.uuid !== product.uuid)
      updateCart(products)
    }
  }
}

function finalPrice() {
  const taxe = TAXES['igic']
  const porcentajeDecimal = taxe / 100
  const igic = amount.value * porcentajeDecimal
  return amount.value += igic
}

  const visible = ref(false)
  const showSimulatedReturnData = ref(false)

   function showTextLoading () {
        visible.value = true
        showSimulatedReturnData.value = false

        setTimeout(() => {
          // visible.value = false
          showSimulatedReturnData.value = true
        }, 3000)
  }

// this is part of our example (so not required)
function onOKClick() {

  if (!step.value) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      step.value = 1
      igic.value = true
    }, 1000)
  } else if (step.value === 1) {
    showTextLoading()
  }
    setTimeout(() => {
      dialogRef.value.hide()
    }, 5000)
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
</style>
