<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row header shadow-10" elevated>
      <div class="col-auto">
        <div class=" q-ma-xs">
          <q-btn
            v-if="$route.query.categoryId"
            @click="$router.back()"
            size="15px"
            class="q-ma-sm"
            rounded
            outline
            icon="mdi-arrow-left"
            color="blue-grey-13"
          />
          <q-img
            v-else
            height="38.58px"
            width="57.72px"
            :ratio="1"
            fit="contain"
            @click="$router.push('/home')"
            class="rounded-borders q-ma-sm"
            src="../assets/logo-removebg.png"
          />
        </div>
      </div>
      <q-tabs
        v-model="tab"
        inline-label
        dense
        v-ripple.center
        indicator-color="light-blue-1"
        active-class="text-blue-grey-10 text-body1"
        class="col header-tabs text-blue-grey-13 knockout active-tabs"
      >
        <q-route-tab
          name="inicio"
          label="Inicio"
          v-ripple.center
          no-caps
          :disable="true"
          exact
        />
        <q-route-tab
          name="categorias"
          v-ripple.center
          label="Categorías"
          to="/home"
          no-caps
          exact
         />
        <q-route-tab
          v-ripple.center
          name="manuales"
          label="Manuales"
          no-caps
          to="/manuales"
          exact
        />
      </q-tabs>

      <q-avatar tag="button" class="col-auto q-pa-sm" size="45px">
        <q-menu
          cover
          transition-show="slide-left"
          style="border-radius: 26px 0px 0px 26px;"
        >
          <div class="row no-wrap q-pa-md text-dark">
            <div class="column">
              <div class="text-subtitle1 q-mb-md text-bold text-blue-grey-13">
                Mi cuenta
              </div>
              <q-separator horizontal class="q-mb-sm" />
              <q-list dense>
                <q-item clickable v-ripple to="/orders">
                  <q-item-section>
                    Pedidos
                  </q-item-section>
                </q-item>

                <!-- <q-item clickable disable v-ripple>
                  <q-item-section no-wrap>
                    Pago
                  </q-item-section>
                </q-item> -->

                <q-item clickable disable v-ripple>
                  <q-item-section>
                    Reclamaciones
                  </q-item-section>
                </q-item>
              </q-list>
              <banner-install-app v-if="store.user.uuid" menu />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="../assets/avatar.jpg">
              </q-avatar>

              <div class="text-subtitle q-mt-md q-mb-xs text-blue-grey-13 knockout" style="letter-spacing: 1px;">
                Hola <span class="text-blue-grey-13"></span>{{ store.user.name }}
              </div>

              <q-btn
                dense
                class="full-width q-mt-auto text-no-wrap"
                text-color="blue-grey-7"
                label="Cerrar sesión"
                @click="store.logout()"
                flat
                size="md"
                no-caps
                uneleveated
              />

            </div>
          </div>
        </q-menu>
          <q-icon name="mdi-account" size="35px" color="blue-grey-14" />
      </q-avatar>

    </q-header>
    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

      </q-list>
    </q-drawer> -->
    <q-page-container class="container">
      <router-view />
    </q-page-container>
    <q-footer
      reveal
      class="main-footer row justify-between q-px-md"
    >
    <div class="column">
      <transition
        appear
        enter-active-class="animated fadeIn"
        :duration="5000"
      >
        <div
          :class="!cart.length ? 'invisible' : 'animated fadeIn'"
          class="q-mr-auto cursor-pointer cart"
          @click="toggleCartDialog"
        >
          <div class="flex q-mb-lg">
              <small class="block full-width q-mb-sm">
                Mi carrito:
              </small>
              <div class="knockout cart-count">
                {{ cart.length }}
              </div>
              <q-icon
                v-ripple.center
                ref="cartItemElement"
                name="mdi-cart-outline"
                color="white"
                class="q-ml-xs bg-transparent"
                :class="showCart ? 'animated headShake' : ''"
                size="28px"
              />
          </div>
        </div>
      </transition>
      <a
        class="col text-blue-grey-1 serpica-title"
        target="_blank"
        href="https://www.serpica.org"
        style="letter-spacing: 1px;"
      >
        SERPICA CANARIAS S.L.
      </a>
    </div>
      <div class="column q-col-gutter-y-md items-end text-bold">
        <q-btn class="no-padding" dense flat no-caps to="/contacto" label="Contacto" />
        <q-btn class="no-padding" dense flat no-caps label="Política de privacidad" />
        <q-btn class="no-padding" dense flat no-caps label="Protección de datos" />
        <div class="row q-mt-sm items-end full-width main-footer-italy">
          <div class="col flag-green" />
          <div class="col flag-white text-dark text-center text-bold text-dark" />
          <div class="col flag-red" />
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { EventBus, morph } from 'quasar'

import useCartDialog from 'src/composables/useCartDialog'
import useCartAnimation from '../composables/useCartAnimation'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const { productQuantity, loading } = useCartAnimation()
    const { toggleCartDialog, cart } = useCartDialog()
    const bus = inject<EventBus>('bus', new EventBus())
    const store = useAuthStore();
    const leftDrawerOpen = ref(null);
    const cartItemElement: Ref<HTMLElement | null> = ref(null)
    const showCart = ref(false);
    const animationMotion = ref(false);

      // Incio animación de producto hacia el carrito
      bus.on('product-to-cart', (from: HTMLDivElement) => {
        // Cancelar animación al añadir un item si ya existe una en curso
        if (animationMotion.value) return

        animationMotion.value = true
        if (cartItemElement.value)

          morph({
                from,
                to: cartItemElement.value.$el,
                duration: 1800,
                delay: 500,
                tweenFromOpacity: 0,
                classes: loading.value ? 'bg-transparent' : '',
                tweenToOpacity: 50,
                keepToClone: true,
                easing: 'ease-in',
                waitFor: 'transitionend',

                onEnd: end => {
                  showCart.value = true;
                  animationMotion.value = false

                  setTimeout(() => {
                    showCart.value = false;
                  }, 1500)
                }
          })
          animationMotion.value = false;
      })

    return {
      store,
      cart,
      loading,
      showCart,
      productQuantity,
      cartItemElement,
      leftDrawerOpen,
      toggleCartDialog,
      tab: ref('categorias'),
    }
  },
});
</script>

<style lang="scss">
  .header {
    background-color: rgb(255, 255, 255,.5);
  }
  .header-tabs .q-tab, .q-tab__label {
    padding: 5px;
    font-size: 13px;
    font-weight: 600;
  }
  @media (min-width: 768px) {
    .header-tabs .q-tab, .q-tab__label {
      padding: 5px;
      font-size: 16px;
      font-weight: 600;
  }
  }
  .main-footer {
    background-position: center;
    background-size: contain;
    background-color: rgba($color: #0000, $alpha: 0.9);
    align-items: center;
    display: flex;
    color: $blue-grey-1;
    font-weight: 600;
    font-size: 18px;
    padding: 1.5em 1em;
  }

  .main-footer-italy .col {
    height: 7px;
  }

  .cart-icon:hover {
    font-size: 45px;
    color: #fff;
  }
  .animated-cart {
    transition-duration: 2s;
  }

  .cart-count {
    display: flex;
    justify-content:center ;
    align-items: center;
    background: #fff;
    color: $dark;
    height: 28px;
    width: 28px;
    font-size: 16px;
    text-align: center;
    align-items: center;
    border-radius: 8px;
  }

  .headShake {
    animation-duration: 2s;
  }
  .active-tabs {
    /* background: $blue-grey-14; */
    /* color: #fff !important; */
  }
  .active-tabs a {
    border-radius: 26px;
  }
</style>
