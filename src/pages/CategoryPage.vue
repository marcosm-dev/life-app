<template>
  <q-page>
    <h4 class="text-center text-bold">
      {{ $route.params.name }}
    </h4>
    <div v-for="product in products" class="row justify-center" :key="product.id">
      <article class="col-12 col-md-8 col-lg-6 q-px-sm">
        <ProductCard :product="product" />
      </article>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Product } from 'src/components/models';
import { defineComponent, ref, onMounted } from 'vue';
import { useLifeStore } from '../stores/life';
import { useRoute } from 'vue-router';

import ProductCard from 'components/ProductCard.vue'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const route = useRoute();
    const store = useLifeStore();
    const products = ref<Product[]>([]);

    onMounted(async() => {
      const { categoryId } = route.query;
      products.value = await store.getCategoryProducts(Number(categoryId))
    })

    return { products };
  },
  components: {
    ProductCard
  }
});
</script>
