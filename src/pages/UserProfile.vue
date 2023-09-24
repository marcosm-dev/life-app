<template>
  <q-page padding>
      <q-form
        @submit="onSubmit"
        class="text-secondary border-radius-sm form-profile q-mx-auto"
        style="max-width: 400px;"
      >
      <q-card class="row bg-transparent" flat>
          <q-card-section class="col-12">
              <p class="text-h7 flex items-center text-grey-10">
                <q-icon
                  name="mdi-account-circle-outline"
                  size="25px"
                  color="blue-grey-14"
                />
                 &nbsp;TU PERFIL:
              </p>
              <q-separator  inset spaced="10px" />
              <q-card-section class="text-body2 row q-col-gutter-y-md ful">
                  <input-profile
                      v-model="userModel.name"
                      label="Nombre"
                      icon="account"
                  />

                    <input-profile
                      v-model="userModel.lastName"
                      label="Apellidos"
                      icon="account"
                    />
                    <input-profile
                      v-model="userModel.VATIN"
                      label="CIF/DNI"
                      icon="account-credit-card"
                    />
                    <input-profile
                      v-model="userModel.phone"
                      label="Teléfono"
                      icon="phone"
                    />
                    <input-profile
                      v-model="userModel.address"
                      icon="address"
                      label="Dirección"
                    />
                    <input-profile
                      icon="postal"
                      v-model="userModel.zipCode"
                      label="Código Postal"
                    />
                    <input-profile
                      icon="id"
                      v-model="userModel.uuid"
                      label="Factura directa identificación (uuid)"
                      no-edit
                    />
              </q-card-section>
          </q-card-section>
          <q-card-actions class="col-12 justify-center">
            <q-btn
                @click="toggleCustomDialog(true)"
                no-caps
                flat
                label="Cambiar contraseña"
              />
          </q-card-actions>
          <q-card-actions class="col-12 q-pa-xl">
            <action-button
              class="full-width"
              type="submit"
              label="Guardar"
            />
          </q-card-actions>
      </q-card>
      </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { User } from 'src/components/models'
import { reactive } from 'vue'
import useAuth from 'src/composables/useAuth'
import useCustomDialog from '../composables/useCustomDialog'

const { toggleCustomDialog } = useCustomDialog({
  type: 'password',
  action: 'update',
  dense: true,
  placeHolder: 'Angua contraseña',
  title: 'Introduce tu antigua contraseña..',
})

const { user } = useAuth()

const userModel = reactive({}) as User

Object.assign(userModel, user.value)

function onSubmit() {
  console.log(userModel)
}

</script>

<style lang="scss">
.form-profile {
  border: 1px inset rgba($color: #000000, $alpha: .2)
}
</style>
