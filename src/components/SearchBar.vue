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
                @keyup.enter="emitSeach"
                @focus="search = ''"
                type="text"
                bg-color="positive"
                outlined
                color="info"
                autofocus
                class="input-search col-2"
                input-class="input-search-class"
                rounded
                dense
              />
          </transition>
      </div>
      <div v-else class="text-caption text-info flex">
        <transition
          appear
          enter-active-class="animated flipInX"
        >
            <div @click="searchModel = !searchModel">
                {{ title }}
             </div>
        </transition>
      </div>
     <div v-if="loading" style="width: 25.72px; height: 25.72px;">
       <q-spinner
          class="q-ml-xs q-mb-xs"
          size="18px"
        />
     </div>
      <q-btn
        v-else
        @click="searchModel && search ? emitSeach : searchModel = !searchModel"
        round
        color="lime-13"
        size="15px"
        padding="0px"
        class="q-my-auto"
        dense
        flat
        icon="mdi-magnify"
      />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['searching'])

import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import useAuth from 'src/composables/useAuth'


const router = useRouter()
const { title, loading } = useAuth()
const searchModel = ref(false)
const search = ref('')
const lastSearch = ref('')


function emitSeach () {
  lastSearch.value = search.value
  if (searchModel.value && search.value !== '') {
    loading.value = true
    router.push(`/category/search:${search.value}`)
  }
}

watch(searchModel, (val) => {
    emit('searching', val)
})


</script>

<style lang="scss">
.input-search .q-field__control {
  height: 20px;
  max-width: 136.48px;
}

</style>
