<template>
  <q-page>
    <q-img
      class="absolute-top" src="~assets/backgrounds/loginbackground-min.webp"
    />
    <q-img
      :style="$q.screen.width >= 546 && 'max-height: 15%; max-width: 50%; margin: auto'"
      class="absolute-bottom" src="~assets/backgrounds/footer.webp"
    />
    <div
      class="justify-center items-center window-height q-px-md q-mx-auto"
      :class="$q.platform.is.mobile ? 'column' : 'row'"
      style="max-width: 450px;"
    >
      <q-card class="row text-center justify-center q-px-none z-max" bordered>
          <q-card-section class="col-12 q-pt-none">
            <h5 class="q-my-lg">
              Acceder
            </h5>
            <q-input
              outlined
              v-model="user.email"
              label="Email"
              :rules="[ val =>  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(val) || 'El email que has escrito es' ]"
              lazy-rules
            />

            <q-input
              outlined
              type="number"
              v-model="user.password"
              label="Contraseña"
              lazy-rules
            />
          </q-card-section>
          <q-card-section class="col-12 q-px-none q-pb-none">
            <q-separator size="2px" />
          </q-card-section>
          <q-card-actions class="col-12 justify-around">
                <q-btn
                  label="Registrar"
                  color="primary"
                  flat
                />
                  <q-btn
                  label="Acceder"
                  type="submit"
                  color="positive"
                  flat
                />
          </q-card-actions>
        <q-card-section class="col-12 q-pt-none">
            <div class="row items-center">
              <q-separator class="col" size="2px" />
              <div class="col-auto q-px-sm text-no-wrap">INFORMACIÓN Y CONTACTO</div>
              <q-separator class="col" size="2px" />
            </div>
            <aside
              id="social-network"
              class="q-gutter-x-md full-width q-py-sm"
            >
              <a href="https://www.instagram.com/serpica.sa/">
                <q-icon size="25px" name="mdi-instagram" color="black"/>
              </a>
              <a href="https://www.homelife.it/es/download/">
                <q-icon size="25px" name="mdi-web" color="black" />
              </a>
              <q-icon size="25px" name="mdi-whatsapp" color="black" />
            </aside>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const user = reactive({
      email: '',
      password: ''
    })
      return {
        onSubmit() {
          console.log(user)
        },
        user,
      }
  },

});
</script>
