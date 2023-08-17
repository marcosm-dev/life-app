<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row header shadow-5 z-max" elevated>
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
            grossy
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
            no-spinner
          />
        </div>
      </div>
      <q-tabs
        v-model="tab"
        inline-label
        dense
        v-ripple.center
        indicator-color="light-blue-1"
        active-class="text-blue-grey-10"
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
          class="z-max"
          transition-show="slide-left"
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
                  <action-button
                    neutro
                    @click="logoutUser"
                    v-ripple
                    label="Cerrar sesión"
                    padding="5px 10px"
                    clickable
                    class="q-mx-auto block q-mt-md"
                    :loading="logoutLoading"
                 />
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
          <banner-install-app v-if="store.user.uuid" menu />
        </q-menu>
        <q-icon name="mdi-account-wrench" size="28px" color="blue-grey-14" />
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
      <router-view v-slot="{ Component, route }">
        <transition
          :name="route.meta.transition || 'fade'"
          :enter-active-class="`animated ${route.meta.transition}`"
        >
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
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
                <div class="knockout cart-count">
                  {{ cart.length }}
                </div>
                <q-icon
                  v-ripple.center
                  ref="cartItemElement"
                  name="mdi-cart-outline"
                  color="blue-2"
                  class="q-ml-xs bg-transparent"
                  :class="showCart ? 'animated headShake' : ''"
                  size="28px"
                />
            </div>
          </div>
        </transition>
        <a
          class="text-blue-grey-1 serpica-title col"
          target="_blank"
          href="https://www.serpica.org"
          style="letter-spacing: 1px;"
        >
          SERPICA CANARIAS S.L.
        </a>
      </div>
      <div class="column items-end text-caption">
        <router-link to="/contacto">Contacto</router-link>
        <router-link to="/home">Política de privacidad</router-link>
        <router-link to="/home">Protección de datos</router-link>
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
        console.log('hola')
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
    background-color: rgb(255, 255, 255,.5);
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
