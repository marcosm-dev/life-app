<template>
  <!-- ...... -->
  <q-select v-model="locale" :options="localeOptions" label="Quasar Language" dense borderless emit-value map-options
    options-dense style="min-width: 150px" />
  <!-- ...... -->
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n({ useScope: 'global' })
const  localeOptions = [
        { value: 'en-US', label: 'English' },
        { value: 'it', label: 'Italian' }
  ]
</script>
