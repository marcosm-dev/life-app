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
          fetchpriority="high"
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

const urlImage = `${url}/productos/${props.image}`
</script>
