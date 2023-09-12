<template>
  <div class="row no-wrap">
      <div v-if="searchModel">
          <transition
            appear
            enter-active-class="animated flipInX"
          >
              <q-input
                v-model.trim="search"
                @blur="emitSeach"
                type="text"
                bg-color="positive"
                outlined
                color="info"
                class="input-search col-2"
                input-class="input-search-class"
                standout
                rounded
                autofocus
                dense
              />
          </transition>
      </div>
      <div v-else class="text-caption text-info flex">
        <transition
          appear
          enter-active-class="animated flipInX"
        >
            <div>
              {{ title }}
             </div>
        </transition>
      </div>
    <q-icon
        @click="searchModel && search ? emitSeach : searchModel = !searchModel"
        name="mdi-magnify"
        class=" q-ml-xs"
        color="grey-1"
        size="20px"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    default: '¿Que estás buscando?'
  }
})
const router = useRouter()
const searchModel = ref(false)
const search = ref('')


function emitSeach () {
  router.push(`/category/search:${search.value}`)
}
</script>

<style lang="scss">
.input-search .q-field__control {
  height: 20px;
  max-width: 136.48px;
}

</style>
