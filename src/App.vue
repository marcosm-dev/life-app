<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useMe from './composables/useMe'
import useInstallApp from './composables/useInstallApp'

export default defineComponent({
  name: 'App',
  setup() {
    useMe()
    useInstallApp()
  }
})
</script>
