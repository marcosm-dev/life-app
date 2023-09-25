<template>
  <!-- ...... -->
  <q-select v-model="locale" :options="localeOptions" label="Quasar Language" dense borderless emit-value map-options
    options-dense style="min-width: 150px" />
  <!-- ...... -->
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { locale, t } = useI18n({ useScope: 'global' })
const  localeOptions = [
        { value: 'es', label: t('lang.options.ES')},
        { value: 'en-US', label: t('lang.options.US') },
        { value: 'it', label: t('lang.options.IT') }
  ]
</script>
