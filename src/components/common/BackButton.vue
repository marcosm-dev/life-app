<template>
   <q-btn
      @click="handleBack"
      size="15px"
      class="q-ma-sm bg-white text-blue-grey-14 no-shadow col-2 border-radius-sm"
      style="width: 57.72px; height: 74%"
      unelevated
    >
    <template  #default>
        <q-icon name="mdi-arrow-left"  class="animated slideInRight" style="animation-duration: 0.1s;" />
    </template>
  </q-btn>
</template>

<script lang="ts" setup>
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()
const router = useRouter()

const { path } = route
const splitPath = path.split('/')

function handleBack() {
  if (splitPath.includes('category')) {
     router.push('/categories')
  } else {
    router.back()
  }
}

onBeforeRouteUpdate((to, from) => {
  console.log(to)
  console.log(from)
})

</script>
