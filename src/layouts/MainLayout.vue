<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="row bg-dark" elevated>
      <div class="col-auto">
        <q-img
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
        active-color="warning"
        class="col header-tabs"
      >
        <q-tab
          name="inicio"
          label="Inicio"
          no-caps
          :disable="true"
        />
        <q-tab
          name="categorias"
          label="Categorías"
          no-caps
         />
        <q-tab
          name="manuales"
          label="Manuales"
          no-caps
        />
      </q-tabs>

      <q-avatar tag="button" class="col-auto q-pa-sm" size="45px">
        <q-menu
          cover
          style="border-top-left-radius: 0;"
        >
          <div class="row no-wrap q-pa-md text-dark">
            <div class="column">
              <div class="text-subtitle1 q-mb-md text-bold">
                Menu de usuario
              </div>
              <q-separator horizontal class="q-mb-sm" />
              <q-list dense >
                <q-item clickable v-ripple>
                  <q-item-section>
                    Pedidos
                  </q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                  <q-item-section>
                    Contacto
                  </q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                  <q-item-section>
                    Reclamaciones
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="../assets/avatar.jpg">
              </q-avatar>

              <div class="text-subtitle1 q-mt-md q-mb-xs">Instalador</div>

              <q-btn
                color="negative"
                dense
                class="full-width"
                label="Salir"
                size="md"
                no-caps
                uneleveated
                v-close-popup
              />

            </div>
          </div>
        </q-menu>
          <img src="../assets/avatar.jpg" />
        </q-avatar>

    </q-header>
    <q-menu>
        <div class="row no-wrap q-pa-md">
          <div class="column">
            <div class="text-h6 q-mb-md">Settings</div>
          </div>

          <q-separator vertical inset class="q-mx-lg" />

          <div class="column items-center">
            <q-avatar size="72px">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg">
            </q-avatar>

            <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

            <q-btn
              color="primary"
              label="Logout"
              push
              size="sm"
              v-close-popup
            />
          </div>
        </div>
      </q-menu>
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

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="main-footer row justify-between q-px-md">
      <p class="text-warning">SERPICA</p>
      <div class="column text-caption items-end text-bold" style="line-height: 0.5;">
        <p>Contacto</p>
        <p>Política de privacidad</p>
        <p>Protección de datos</p>
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
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const leftDrawerOpen = ref(null);

    return {
      leftDrawerOpen,
      tab: ref('categorias'),
    };
  },
});
</script>

<style lang="scss">
  .header-tabs .q-tab, .q-tab__label {
    padding: 5px;
    font-size: 13px;
    font-weight: 600;
  }
  .main-footer {
    background-position: center;
    background-size: contain;
    height: 100px;
    background-color: #181818;
    align-items: center;
    display: flex;
    color: $positive;
    font-weight: 600;
    font-size: 20px;
  }

  .main-footer-italy .col {
    height: 7px;
  }
</style>
