<template>
    <q-select
      v-model="locale"
      :options="langOptions"
      dense
      emit-value
      outlined
      :display-value="appLanguages.find(el => el.isoName === $q.lang.isoName)?.nativeName"
      behavior="menu"
      borderless
      popup-content-class="bg-primary text-white"
      emit-valuemap-options
      options-dens
    />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import languages from 'quasar/lang/index.json'
import { watch } from 'vue'
import { useQuasar } from 'quasar'

const { locale } = useI18n({ useScope: 'global' })
const $q = useQuasar()

const appLanguages = languages.filter(lang =>
  ['es', 'it'].includes(lang.isoName)
)
const langOptions = appLanguages.map(lang => ({
  label: lang.nativeName, value: lang.isoName
}))
watch(locale, async () => {
  const langModule = await import(`../../../node_modules/quasar/lang/${locale.value}.mjs`)
  $q.lang.set(langModule.default)
})

</script>
