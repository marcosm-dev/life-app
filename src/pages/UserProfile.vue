<template>
  <q-page padding>
      <q-form
        @submit="onSubmit"
        class="text-secondary border-radius-sm form-profile q-mx-auto"
        style="max-width: 400px;"
      >
      <q-card  class="row justify-between bg-transparent" flat >
          <q-card-section class="col-12">
              <div
                @click="edit ? edit = false : null"
                class="text-h7 flex items-center text-grey-10 justify-between"
              >
                <q-icon
                  name="mdi-account-circle"
                  size="38px"
                  color="blue-grey"
                />
                 &nbsp;{{ $t('profile.title').toUpperCase() }}:
                <q-btn
                    @click.stop.prevent="edit = !edit"
                    class="col-auto"
                    round
                    outline
                    color="info"
                    padding="4px"
                    size="15px"
                    icon="mdi-pencil-outline"
                  />
              </div>
              <q-separator  inset spaced="10px" />
              <q-card-section class="text-body2 row q-col-gutter-y-md ful">
                  <div class="flex justify-between full-width">
                    <p class="q-mb-sm col q-mt-none text-grey-8">
                        {{ $t('profile.personalData') }}:
                    </p>
                  </div>
                  <q-separator class="col-12" color="blue-grey" />
                  <input-profile
                      v-model="userModel.name"
                      :label="$t('auth.form.name')"
                      :readonly="edit"
                  />
                    <input-profile
                      v-model="userModel.lastName"
                      :label="$t('auth.form.lastName')"
                      :readonly="edit"
                    />
                    <input-profile
                      v-model="userModel.businessName"
                      :label="$t('auth.form.businessName')"
                      :readonly="edit"
                    />
                    <input-profile
                      v-model="userModel.VATIN"
                      :label="$t('auth.form.VATIN')"
                      :readonly="edit"
                    />
                    <input-profile
                      v-model="userModel.phone"
                      :label="$t('auth.form.phone')"
                      :readonly="edit"
                    />
                    <p class="q-mb-sm q-mt-lg text-grey-8 q-mt-none">
                      {{ $t('auth.form.address') }} {{ $t('common.and') }} {{ $t('auth.form.postalCode') }}:
                    </p>
                    <q-separator class="col-12" color="blue-grey" />
                    <input-profile
                      v-model="userModel.address"
                      icon="address"
                      :label="$t('auth.form.address')"
                      :readonly="edit"
                    />
                    <input-profile
                      v-model="userModel.zipCode"
                      :label="$t('auth.form.postalCode')"
                      :readonly="edit"
                    />

                    <p class="q-mb-sm q-mt-lg text-grey-8 q-mt-none">
                      {{ $t('profile.credentials') }}:
                    </p>
                    <q-separator  class="col-12" color="blue-grey" />
                    <input-profile
                      v-model="userModel.email"
                      :label="$t('auth.form.email')"
                      :readonly="edit"
                    />
                    <input-profile
                      v-model="userModel.uuid"
                      :label="$t('profile.label.uuid')"
                      no-edit
                    />
                    <p class="q-mb-sm q-mt-lg text-grey-8 q-mt-none">
                        {{ $t('profile.label.language') }}:
                      </p>
                    <q-separator  class="col-12" color="blue-grey" />
                    <switcher-language class="col-12" />
              </q-card-section>
          </q-card-section>
          <q-card-actions class="col-12 justify-center">
            <q-btn
                @click="toggleCustomDialog(true)"
                no-caps
                color="grey-8"
                flat
                :label="$t('profile.changePassword')"
              />
          </q-card-actions>
          <q-card-actions class="col-12 " :class="edit ? 'q-pa-xl' : ''">
            <action-button
              v-if="edit"
              :neutro="edit"
              class="full-width"
              type="submit"
              :label="$t('common.save')"
            />
          </q-card-actions>
      </q-card>
      </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { IUser } from 'src/components/models'
import { reactive, ref } from 'vue'
import useAuth from 'src/composables/useAuth'
import useCustomDialog from '../composables/useCustomDialog'

const { toggleCustomDialog } = useCustomDialog('password')
const { user } = useAuth()

const edit = ref(false)
const userModel = reactive({}) as IUser

Object.assign(userModel, user.value)

function onSubmit() {
  edit.value = false
  console.log(userModel)
}

</script>

<style lang="scss">
.form-profile {
  border: 1px inset rgba($color: #000000, $alpha: .2)
}
</style>
