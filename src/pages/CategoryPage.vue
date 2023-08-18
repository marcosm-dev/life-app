<template>
  <q-page>
    <h4 class="row justify-around q-px-md">
      {{ category }}
    </h4>
    <div class="row justify-center">
        <ProductCard
          class="q-mx-sm col-sm-8 col-12 col-lg-4 col-md-6"
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
    const { id } = route.params

    const { result: categoryResult, loading } = useQuery(gql`
      query categoryById ($id: ID!) {
        getCategoryById(id: $id) {
          id
          name
        }
      }
    `, {
      id
    })

     const { result, loading: productsLoading } = useQuery(gql`
      query getProductsByCategory($id: ID!) {
        getProductsByCategory(categoryId: $id) {
          id
          urlImage
          name
          categoryId
          price
          stock
          description
          accessories
        }
      }
    `, () => ({
      id
    }))

    console.log('hola desde categorias')


    return {
      products: computed(() => result.value?.getProductsByCategory),
      category: computed(() => categoryResult.value?.getCategoryById.name),
      loading,
      productsLoading,
    };
  },
  components: {
    ProductCard
  }
})
</script>
