<template>
  <q-page>
    <h4 class="text-center text-bold">
      {{ $route.params.name }}
    </h4>
    <div
      v-for="product in products"
      class="row justify-center"
      :key="product.id"
    >
      <article class="col-12 col-md-8 col-lg-6 q-px-sm">
        <ProductCard :product="product" />
      </article>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import ProductCard from 'components/ProductCard.vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

export default defineComponent({
  name: 'CategoryPage',
  setup() {
    const route = useRoute();
    const { categoryId } = route.query;

     const { result } = useQuery(gql`
      query getProductsByCategory($categoryId: ID!) {
        getProductsByCategory(categoryId: $categoryId) {
          id
          urlImage
          name
          price
          stock
          description
          accessories
        }
      }
    `, () => ({
      categoryId
    }))

    return { products: computed(() => result.value?.getProductsByCategory) };
  },
  components: {
    ProductCard
  }
});
</script>
