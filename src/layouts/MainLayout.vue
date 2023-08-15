<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row header" elevated>
      <div class="col-auto">
        <div v-if="$route.query.categoryId" class="flex q-ma-xs">
          <q-btn
            @click="$router.back()"
            size="15px"
            class="q-ma-sm"
            rounded
            icon="mdi-arrow-left"
            color="blue-grey-1"
            text-color="blue-grey-14"
          />
        </div>
        <q-img
          v-else
          @click="$router.push('/home')"
          class="rounded-borders q-ma-xs"
          width="84px"
          src="../assets/logo.jpg"
        />
      </div>
      <q-tabs
        v-model="tab"
        inline-label
        dense
        indicator-color="warning"
        active-color="dark"
        active-class="bg-dark-page text-subtitle1"
        class="col header-tabs"
      >
        <q-route-tab
          name="inicio"
          label="Inicio"
          no-caps
          :disable="true"
          exact
        />
        <q-route-tab
          name="categorias"
          label="Categorías"
          to="/home"
          no-caps
          exact
         />
        <q-route-tab
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
          class="full-auto"
          style="border-top-left-radius: 0;"
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
                <q-item v-if="store.user.uuid" clickable disable v-ripple >
                  <banner-install-app dense menu />
                </q-item>
              </q-list>
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="../assets/avatar.jpg">
              </q-avatar>

              <div class="text-subtitle q-mt-md q-mb-xs knockout text-blue-grey-13">
                Hola <span class="text-blue-grey-13"></span>{{ store.user.name }}
              </div>

              <q-btn
                outline
                text-color="accent"
                dense
                class="full-width q-mt-auto"
                label="Salir"
                @click="store.logout()"
                size="md"
                no-caps
                uneleveated
              />

            </div>
          </div>
        </q-menu>
          <img
            width="45px"
            height="45px"
            src="../assets/avatar.jpg"
            alt="imagen de usuario"
          />
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
      <a href="https://www.serpica.org" class="col-auto text-warning serpica-title">
        SERPICA
      </a>
      <transition
        appear
        enter-active-class="animated fadeIn"
        :duration="5000"
      >
        <div
          :class="!cart.length ? 'hidden' : 'animated fadeIn'"
          class="col q-ml-md cursor-pointer cart-container"
          @click="toggleCartDialog"
        >
            <div class="flex">
                <q-icon
                  ref="cartItemElement"
                  name="mdi-cart-arrow-down"
                  color="blue-grey-1"
s                 class="q-my-auto q-ml-xs"
                  :class="showCart ? 'animated headShake' : ''"
                  size="30px"
                />
            </div>
        </div>
      </transition>
      <div class="column q-col-gutter-y-md text-caption items-end text-bold" style="line-height: 0.5;">
        <router-link class="q-mb-xs" to="/contacto">Contacto</router-link>
        <a href="#">Política de privacidad</a>
        <a href="#">Protección de datos</a>
        <div class="row full-width main-footer-italy">
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
                delay: 200,
                tweenFromOpacity: 0,
                classes: loading.value ? 'bg-transparent' : '',
                tweenToOpacity: 50,
                keepToClone: true,
                easing: 'ease-in',
                waitFor: 'transitionend',

                onEnd: end => {
                  animationMotion.value = false
                }
          })
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
    background: #333b41F2;
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
    height: 100px;
    background-color: rgb(20, 20, 20,0.96);
    align-items: center;
    display: flex;
    color: $positive;
    font-weight: 600;
    font-size: 20px;
  }

  .main-footer-italy .col {
    height: 7px;
  }

  .cart-icon:hover {
    font-size: 45px !important;
    color: #fff !important;
  }
  .animated-cart {
    transition-duration: 2s !important;
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
    border-radius: 12px;
  }

  .headShake {
    animation-duration: 2s;
  }

</style>
