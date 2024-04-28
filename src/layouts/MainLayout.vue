<template>
  <q-layout view="lHh Lpr lFf">
      <q-header
        class="shadow-5 row justify-between z-top bg-primary  border-radius-sm q-ma-sm no-wrap"
        :style="$route.params.id ? 'border-top-left-radius: 22px; border-bottom-left-radius: 22px;' : ''"
      >
          <div class="col-auto">
              <back-button v-if="$route.params.id" />
                <!-- :fit="toggleLogo ? 'scale-down' : 'contain'" -->
              <q-img
                v-else
                height="38.58px"
                width="57.72px"
                fit="scale-down"
                @click="$router.push('/')"
                class="rounded-borders q-ma-sm col-2"
                :src="logo"
                no-spinner
              />
          </div>
          <div class="column q-ml-sm q-my-auto text-no-wrap no-wrap q-mr-auto">
              <a
                class="text-subtitle text-subtitle3 text-white"
                :class="search && 'no-pointer-events'"
                target="_blank"
                :href="clientWebsite"
                style="letter-spacing: 1px"
              >
              {{ name }}
            </a>
            <search-bar
              @searching="(val) => search = val"
            />
        </div>
        <banner-install-app class="col-auto" type="Header" />
        <tasty-burger-button @toggle="drawer = !drawer" :isActive="drawer" />
        <q-avatar tag="button" class="col-auto" size="45px">
            <q-menu
              v-model="drawer"
              :offset="[-5, 20]"
              transition-show="slide-left"
              transition-hide="slide-right"
              class="border-radius-sm q-pa-sm bg-primary"
            >
              <div class="row justify-end text-right">
                <div class="column">
                  <q-list dense class="font-bold text-grey-2">

                    <!-- <q-item clickable disable v-ripple>
                      <q-item-section no-wrap>
                        Pago
                      </q-item-section>
                    </q-item> -->

                    <q-item clickable  v-ripple to="/contacto">
                      <q-item-section class="text-no-wrap">
                          {{ $t('menu.paymentMethods') }}
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple to="/orders">
                      <q-item-section>
                          {{ $t('menu.myOrders') }}
                      </q-item-section>
                    </q-item>
                    <q-item clickable disable v-ripple>
                      <q-item-section>
                        {{  $t('menu.refund') }}
                      </q-item-section>
                    </q-item>
                    <!-- <q-item clickable disable v-ripple>
                      <q-item-section> Reclamaciones </q-item-section>
                    </q-item> -->
                    <q-item clickable  v-ripple to="/profile">
                      <q-item-section>
                        {{ $t('menu.config') }}
                      </q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple to="/contacto">
                      <q-item-section>
                        {{ $t('menu.contact') }}
                      </q-item-section>
                    </q-item>
                    <q-item class="q-mt-sm" clickable @click="logoutUser">
                      <q-item-section>
                        <q-spinner v-if="logoutLoading" color="positive" size="1.5em" class="q-ml-auto q-mr-md" />
                        <template v-else>
                          {{  $t('menu.logout') }}
                        </template>
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
            :label="$t('footer.tabs.home')"
          />
          <q-route-tab
            to="/manuales"
            name="mails"
            no-caps
            icon="mdi-library"
            :label="$t('footer.tabs.manuals')"
          />
          <q-route-tab
            v-if="cart.length"
            class="tab-cart"
            @click="toggleCartDialog"
            name="Carrito"
            no-caps
            :label="$t('footer.tabs.cart')"
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
import { defineComponent, ref, inject, Ref, computed } from 'vue';
import { EventBus, morph } from 'quasar'
import { onBeforeRouteUpdate } from 'vue-router'
import { QuasarHTMLElement } from '@quasar/app'

import useCartDialog from '../composables/useCartDialog'
import useCartAnimation from '../composables/useCartAnimation'
import useAuth from '../composables/useAuth'
import SearchBar from 'src/components/SearchBar.vue'
import HamburguerElastic from 'components/HamburguerElastic.vue'
import { useI18n } from 'vue-i18n'
import * as config from '../../user.config'
const { name } = config.default

export default defineComponent({
  name: 'MainLayout',
  components: {
      'tasty-burger-button': HamburguerElastic,
      SearchBar,
  },
  setup() {
    const { productQuantity, loading, toggle } = useCartAnimation()
    const { cart, toggleCartDialog } = useCartDialog()
    const toggleLogo = ref(false)
    const search = ref(true)
    const searchText = ref('')
    const { t } = useI18n()

    const {
      logoutUser,
      logoutLoading,
      title,
      deferredPrompt,
    } = useAuth();
    const bus = inject<EventBus>('bus', new EventBus())
    const leftDrawerOpen = ref(null)
    const cartItemElement: Ref<QuasarHTMLElement | null> = ref(null)
    const animationMotion = ref(false)
    const drawer = ref(false)
    const productSelected  = ref(null)
    const url = process.env.IMAGES_URL

    onBeforeRouteUpdate((to, from) => {
      const fromSplit = from.path.split('/')
      if (title.value === '' || !fromSplit.includes('category' || 'product')) title.value = t('common.anySearch')
      if (to.path === '/categories') toggleLogo.value = !toggleLogo.value
    })

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
            toggle(false)
            setTimeout(() => {
              animationMotion.value = false;
            }, 1500);
          },
        })
        animationMotion.value = false;
        }
    })

    return {
      logo: computed(() => {
        // if (locale.value === 'it') return `${url}/life_logo_white`
        return `${url}/${'aprimatic_logo'}_white`
      }),
      clientWebsite: process.env.CLIENT_WEBSITE,
      title,
      name,
      drawer,
      search,
      cart,
      logoutUser,
      loading,
      toggleLogo,
      logoutLoading,
      searchText,
      animationMotion,
      productQuantity,
      toggleCartDialog,
      cartItemElement,
      deferredPrompt,
      leftDrawerOpen,
      productSelected,
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
