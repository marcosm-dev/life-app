<template>
      <q-img
        :src="urlImage"
        height="90px"
        fit="scale-down"
        fetchpriority="high"
      >
          <template #error>
            <q-img
              :src="`${brand.toLowerCase()}_logo.png`"
              fit="scale-down"
              height="90px"
              class="bg-transparent border-radius-md"
            />
          </template>
        </q-img>
</template>


<script setup>
const props = defineProps({
  image: String,
  brand: String,
})
const url = process.env.IMAGES_URL

const urlImage = `${url}/productos/v1/${props.image}`
</script>
