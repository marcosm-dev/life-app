<template>
  <q-card-section class="q-pt-none q-px-none col-12">
        <q-input
            v-if="$route.path === '/profile'"
            outlined
            color="blue-grey-14"
            clearable
            item-aligned
            rounded
            :type="revealPassword ? 'text' : 'password'"
            :error-message="$t('auth.errors.wrongPassword')"
            :modelValue="oldPassword"
            @update:model-value="(value) => $emit('update:oldPassword', value)"
            :label="type === 'password' ? $t('dialogs.recovery.currentPassword') : $t('dialogs.recovery.newPassword')"
          >
        <template #append>
          <q-icon
            :name="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
            class="cursor-pointer"
            @click="revealPassword = !revealPassword"
          />
        </template>
        </q-input>
        <q-input
          outlined
          color="blue-grey-14"
          clearable
          item-aligned
          rounded
          :modelValue="password"
          :type="revealPassword ? 'text' : 'password'"
          @update:model-value="(value) => $emit('update:password', value)"
          :error-message="$t('dialogs.recovery.errors.samePassword')"
          :label="type === 'password' ? $t('dialogs.recovery.newPassword') : $t('dialogs.recovery.newPasswordRepeat')"
        >
        <template #append>
          <q-icon
            :name="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
            class="cursor-pointer"
            @click="revealPassword = !revealPassword"
          />
        </template>
      </q-input>
        <q-input
            outlined
            color="blue-grey-14"
            clearable
            item-aligned
            rounded
            :rules="[(val: string) => val === password]"
            v-model="confirm"
            :type="revealPassword ? 'text' : 'password'"
            :error-message="$t('dialogs.recovery.errors.samePassword')"
            :label="$t('dialogs.recovery.newPasswordRepeat')"
          >
          <template #append>
            <q-icon
              :name="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
              class="cursor-pointer"
              @click="revealPassword = !revealPassword"
            />
          </template>
        </q-input>
    </q-card-section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const confirm = ref('')
defineProps(['type', 'password', 'oldPassword'])
defineEmits(['update:password', 'update:confirm'])
const revealPassword = ref(false)

</script>
