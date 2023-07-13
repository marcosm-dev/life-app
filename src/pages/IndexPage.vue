<template>
  <q-page class="q-pb-xl">
    <h5 class="text-bold q-mx-auto text-center text-h6">
      ¿Qué tipo de producto buscas?
    </h5>
    <div
      class="row q-mx-md"
      :class="$q.screen.width < 768 ? 'q-mx-md' : 'q-col-gutter-md'"
    >
      <div
        v-for="category in categories"
        :key="category.id"
        class="col-12 col-md-6 col-lg-4"
      >
          <q-card
            class="cursor-pointer q-mb-md q-mt-md text-center"
            @click="$router.push(`/category/${category.name}?categoryId=${category.id}`)"
          >
            <q-img
              :src="category.urlImage || '../src/assets/logo.jpg'"
              width="340px"
              height="200px"
              fit="contain"
              fetchpriority="high"
            />
            <div class="text-subtitle1 text-center  bg-dark text-white q-py-xs">
              {{ category.name }}
            </div>
          </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Category } from 'src/components/models';
import { defineComponent, ref, onMounted } from 'vue';
import { useLifeStore } from '../stores/life';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const store = useLifeStore();
    const categories = ref<Category[]>([]);

    onMounted(async() => {

      categories.value = await store.getCategories()
    })

    return { categories };
  },
});
</script>
