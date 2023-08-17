<template>
  <q-page>
    <h4 class="q-px-md">
      {{ $route.params.name }}
    </h4>
    <div class="row justify-center">
         <ProductCard
            class="q-mx-sm col-12 col-lg-4 col-md-6"
            v-for="product in products"
            :key="product.id"
            :product="product"
         />
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

import ProductCard from 'components/ProductCard.vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default defineComponent({
  name: 'CategoryPage',
  setup() {
    const route = useRoute()
    const { categoryId } = route.query

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
})
</script>
