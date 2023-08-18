<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header shadow-5 row z-top" elevated>
      <transition
        appear
        enter-active-class="animated flipInX"
      >
          <div class="col-auto">
            <q-btn
              v-if="$route.params.id"
              @click="$router.back()"
              size="15px"
              class="q-ma-sm bg-white text-blue-grey-14 no-shadow col-2"
              rounded
              style="width: 57.72px"
              icon="mdi-arrow-left"
            />
            <q-img
              v-else
              height="38.58px"
              width="57.72px"
              :ratio="1"
              fit="contain"
              @click="$router.push('/')"
              class="rounded-borders q-ma-sm col-2"
              src="../assets/logo-removebg.png"
              no-spinner
            />
          </div>
      </transition>
      <a
        class="serpica-title q-my-auto q-mr-auto col-auto offset-1 q-mx-auto"
        target="_blank"
        href="https://www.serpica.org"
        style="letter-spacing: 1px;"
      >
          SERPICA CANARIAS S.L.
      </a>

      <q-avatar tag="button" class="col-auto q-pa-sm" size="45px">
        <q-menu
          cover
          class="z-max text-center"
          transition-show="slide-left"
          transition-hide="slide-right"
          style="border-radius: 26px 0px 0px 26px;"
        >
          <div class="row no-wrap q-pa-md text-dark text-left">
            <div class="column">
              <div class="text-subtitle1 q-mb-md text-blue-grey-13">
                Mi cuenta
              </div>
              <q-separator horizontal class="q-mb-sm" />
              <q-list dense>
                <q-item clickable v-ripple to="/orders" disable>
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
                 <q-item>
                  <action-button
                    neutro
                    @click="logoutUser"
                    v-ripple
                    label="Cerrar sesión"
                    padding="2px 10px"
                    flat
                    clickable
                    class="block q-mt-md text-no-wrap"
                    :loading="logoutLoading"
                 />
                 </q-item>
              </q-list>
            </div>
            <q-separator vertical inset class="q-mx-md" />
            <div class="column items-center">
              <q-avatar size="50px">
                <img src="../assets/avatar.jpg">
              </q-avatar>

              <div class="text-caption q-mt-md q-mb-xs text-blue-grey-14" style="letter-spacing: -.5px;">
                {{ store.user.name }}
              </div>
            </div>
          </div>
          <banner-install-app menu />
          <!-- <banner-install-app v-if="store.user.uuid" menu /> -->
        </q-menu>
        <q-icon name="mdi-account-wrench" size="28px" color="grey-12" />
      </q-avatar>

      <q-tabs
        v-model="tab"
        v-ripple.center
        switch-indicator
        indicator-color="light-blue-1"
        outside-arrows
        dense
        active-class="light-blue-1"
        class="knockout q-mx-auto q-mx-auto"
        :class="!$q.screen.gt.xs ? 'col-auto' : 'col-12'"
      >
        <q-route-tab
          name="inicio"
          label="Inicio"
          v-ripple.center
          no-caps
          to="/"
        />
        <q-route-tab
          v-ripple.center
          name="manuales"
          label="Manuales"
          no-caps
          to="/manuales"
        />
      </q-tabs>


    </q-header>
    <q-page-container class="container">
      <router-view v-slot="{ Component, route }">
        <transition
          :name="route.meta.transition || 'fade'"
          :enter-active-class="`animated ${route.meta.transition}`"
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
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
            class="q-mr-auto cursor-pointer cart col"
            @click="toggleCartDialog"
          >
            <div class="flex q-mb-lg">
                <small class="block full-width q-mb-sm">
                  Mi carrito:
                </small>
                <q-icon
                  v-ripple.center
                  color="light-blue-1"
                  ref="cartItemElement"
                  name="mdi-cart-arrow-right"
                  class="q-ml-xs bg-transparent"
                  :class="showCart ? 'animated headShake' : ''"
                  size="28px"
                />
                <div class="knockout cart-count">
                  {{ cart.length }}
                </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="column items-end text-caption">
        <router-link class="inter" to="/contacto">Contacto</router-link>
        <router-link class="inter" to="/home">Política de privacidad</router-link>
        <router-link class="inter" to="/home">Protección de datos</router-link>
        <div class="row q-mt-sm full-width main-footer-italy q-mt-lg">
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
import useAuth from '../composables/useAuth';
import { onBeforeRouteUpdate } from 'vue-router'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const { productQuantity, loading } = useCartAnimation()
    const { toggleCartDialog, cart } = useCartDialog()
    const { logoutUser, logoutLoading } = useAuth()
    const bus = inject<EventBus>('bus', new EventBus())
    const store = useAuthStore()
    const leftDrawerOpen = ref(null)
    const cartItemElement: Ref<HTMLElement | null> = ref(null)
    const showCart = ref(false)
    const animationMotion = ref(false)
    const isParent = ref(false)

    onBeforeRouteUpdate((to, from) => {
      const toSplit = to.path.split('/')
      // const fromSplit = from.path.split('/')

      if(toSplit.includes('home')) {
        isParent.value = true
      } else {
        isParent.value = false
      }
    })

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
                // delay: 500,
                tweenFromOpacity: 0,
                classes: loading.value ? 'bg-transparent' : '',
                keepToClone: true,
                easing: 'ease-in-out',
                // waitFor: 'transitionend',

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
      isParent,
      store,
      cart,
      logoutUser,
      loading,
      logoutLoading,
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
    background-color: rgba($color: #263238  , $alpha: 0.7);
  }
  @media (min-width: 768px) {
    .header-tabs .q-tab, .q-tab__label {
      padding: 5px;
      font-weight: 600;
  }
  }
  .main-footer {
    background-position: center;
    background-size: contain;
    background-color: rgba($color: #263238  , $alpha: 0.7);
    align-items: center;
    display: flex;
    color: #fff;
    font-size: 18px;
    padding: 1em;
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
    background: rgba($color: #e1f5fe, $alpha: 0.9) ;
    color: $dark;
    height: 22px;
    width: 22px;
    margin: auto 0;
    font-size: 14px;
    text-align: center;
    align-items: center;
    border-radius: 26px;
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

  .toggle-back {
    opacity: 0;
  }
</style>
