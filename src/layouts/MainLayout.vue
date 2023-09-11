<template>
  <q-layout view="lHh Lpr lFf">
      <q-header
        class="shadow-5 row justify-between z-top bg-primary  border-radius-sm q-ma-sm no-wrap"
        :style="$route.params.id ? 'border-top-left-radius: 22px; border-bottom-left-radius: 22px;' : ''"
      >
        <div class="col-auto">
              <q-btn
                   v-if="$route.params.id"
                  @click="$router.back()"
                  size="15px"
                  class="q-ma-sm bg-white text-blue-grey-14 no-shadow col-2 border-radius-sm"
                  style="width: 57.72px; height: 74%"
                  unelevated
                >
              <template  #default>
                  <q-icon name="mdi-arrow-left"  class="animated slideInRight" style="animation-duration: 0.1s;" />
              </template>
            </q-btn>

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
        <div class="col q-ml-sm q-my-auto text-no-wrap">
          <a
              class="text-subtitle text-subtitle3 text-white"
              target="_blank"
              href="https://www.serpica.org"
              style="letter-spacing: 1px"
            >
            SERPICA CANARIAS S.L.
          </a>
          <div v-show="title" class="text-caption text-light-blue-11">
            {{ title }}
          </div>
        </div>
        <banner-install-app type="Header" />
        <tasty-burger-button @toggle="drawer = !drawer" :isActive="drawer" />
        <q-avatar tag="button" class="col-auto" size="45px">
            <q-menu
              v-model="drawer"
              :offset="[-5, 20]"
              transition-show="slide-left"
              transition-hide="slide-right"
              class="border-radius-sm q-pa-sm bg-primary"
            >
              <div class="row justify-end text-white text-right">
                <div class="column">
                  <q-list dense class="text-white font-bold">
                    <q-item clickable v-ripple to="/orders" disable>
                      <q-item-section> Mis Pedidos </q-item-section>
                    </q-item>

                    <!-- <q-item clickable disable v-ripple>
                      <q-item-section no-wrap>
                        Pago
                      </q-item-section>
                    </q-item> -->

                    <q-item clickable disable v-ripple>
                      <q-item-section> Devoluciones </q-item-section>
                    </q-item>
                    <q-item clickable disable v-ripple>
                      <q-item-section> Reclamaciones </q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple to="/contacto">
                      <q-item-section class="text-positive"> Contacto </q-item-section>
                    </q-item>
                    <q-item class="q-mt-sm" clickable @click="logoutUser">
                      <q-item-section>
                        <q-spinner v-if="logoutLoading" color="positive" size="1.5em" class="q-ml-auto q-mr-md" />
                        <template v-else>Cerrar sesión</template>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-menu>
            <!-- <q-btn class="block" flat round dense icon="mdi-menu" /> -->
        </q-avatar>
      </q-header>
      <q-page-container class="container">
        <router-view v-slot="{ Component, route }">
          <transition
            :enter-active-class="`animated ${route.meta.transition}`"
          >
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </q-page-container>
      <q-footer
          reveal
          class="row justify-center q-px-md bg-transparent border-radius-md q-mx-auto"
        >
        <q-tabs
          v-model="tab"
          indicator-color="transparent"
          active-color="lime-14 bg-dark bg-secondary"
          class="shadow-2  border-radius-md q-mb-sm bg-primary"
        >
          <q-route-tab
            to="/home"
            name="Home"
            icon="mdi-home"
            no-caps
            label="Inicio"
          />
          <q-route-tab
            to="/manuales"
            name="mails"
            no-caps
            icon="mdi-library"
            label="Manuales"
          />
          <q-route-tab
            v-if="cart.length"
            class="tab-cart"
            @click="toggleCartDialog"
            name="Carrito"
            no-caps
            label="Carrito"
          >
            <div class="flex">
                <q-icon
                  ref="cartItemElement"
                  color="lime-13"
                  name="mdi-cart-arrow-right"
                  class="q-ml-xs bg-transparent"
                  :class="!loading && !animationMotion ? 'animated headShake' : ''"
                  size="26px"
                />
                <div class="cart-count" key="cart-count">
                    {{ cart.length }}
                </div>
          </div>
          </q-route-tab>
        </q-tabs>

        <!-- <div class="column items-end text-caption">
          <div class="row q-mt-sm full-width main-footer-italy q-mt-sm">
            <div class="col flag-green" />
            <div class="col flag-white text-dark text-center text-bold text-dark"  />
            <div class="col flag-red" />
          </div>
        </div> -->
      </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, inject, Ref } from 'vue'
import { EventBus, morph } from 'quasar'

import useCartDialog from '../composables/useCartDialog'
import useCartAnimation from '../composables/useCartAnimation'
import useAuth from '../composables/useAuth'
import HamburguerElastic from 'components/HamburguerElastic.vue'
import { QuasarHTMLElement } from '@quasar/app'

export default defineComponent({
  name: 'MainLayout',
  components: { 'tasty-burger-button': HamburguerElastic },
  setup() {
    const { productQuantity, loading, toggle } = useCartAnimation();
    const { cart, toggleCartDialog } = useCartDialog();
    const {
      logoutUser,
      logoutLoading,
      title,
      deferredPrompt,
      hideBanner
    } = useAuth();
    const bus = inject<EventBus>('bus', new EventBus());
    const leftDrawerOpen = ref(null);
    const cartItemElement: Ref<QuasarHTMLElement | null> = ref(null);
    const animationMotion = ref(false);
    const drawer = ref(false);

    // Incio animación de producto hacia el carrito
    bus.on('product-to-cart', (from: HTMLElement) => {
      // Cancelar animación al añadir un item si ya existe una en curso
      if (animationMotion.value) return;

      animationMotion.value = true;
      if (cartItemElement.value) {
        const to = cartItemElement.value.$el
        morph({
          from,
          to,
          duration: 1800,
          // delay: 500,
          tweenToOpacity: 1,
          classes: loading.value ? 'bg-transparent' : '',
          keepToClone: true,
          hideFromClone: true,
          easing: 'ease-in-out',
          // waitFor: 'transitionend',

          onEnd: () => {
            console.log('enta')
            toggle(false)
            setTimeout(() => {
              animationMotion.value = false;
            }, 1500);
          },
        });
        animationMotion.value = false;
        }

    });

    return {
      title,
      drawer,
      cart,
      logoutUser,
      loading,
      hideBanner,
      logoutLoading,
      animationMotion,
      productQuantity,
      toggleCartDialog,
      cartItemElement,
      deferredPrompt,
      leftDrawerOpen,
      tab: ref('categorias'),
      foooterTabs: ref('home'),
    };
  },
});
</script>

<style lang="scss">
@media (min-width: 768px) {
  .header-tabs .q-tab,
  .q-tab__label {
    padding: 5px;
    font-weight: 600;
  }
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
  justify-content: center;
  background: #fff;
  font-weight: 600;
  color: $blue-grey !important;
  height: 22px;
  font-size: 10px;
  width: 22px;
  margin: auto 0;
  text-align: center;
  align-items: center;
  border-radius: 50px;
}

.headShake {
  animation-duration: 2s;
}

.active-tabs a {
  border-radius: 26px;
}

.toggle-back {
  opacity: 0;
}

.tab-cart .q-tab__content {
  flex-direction: column-reverse;
}
</style>
