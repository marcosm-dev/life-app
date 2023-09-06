<template>
  <q-page padding>
        <q-card
          v-if="loading"
          class="column justify-end col-sm-8 col-12 col-lg-4 col-md-6 q-mb-lg shadow-12 rounded-card q-col-gutter-y-xl"
          style="min-height: 607px"
        >

          <q-card-section class="column">
            <q-skeleton
              width="170px"
              height="100px"
              class="rounded-card col-12 q-mb-xl"
            />
            <div class="flex justify-between items-end">
              <q-skeleton width="100px" class="q-mt-md" />
              <q-skeleton width="120px" height="20px" />
            </div>
          </q-card-section>

          <q-separator class="col-12" size="1px" inset />
          <q-card-section class="q-gutter-y-md">
            <q-skeleton class="full-width" />
            <q-skeleton width="60%" />
          </q-card-section>

          <q-card-section class="row justify-between">
            <q-skeleton class="col-auto" width="127px" />
            <q-skeleton width="20px" />
            <q-skeleton class="col-auto" width="127px" />
          </q-card-section>


          <q-card-actions class="row q-pa-md">
            <q-skeleton width="50%" class="rounded-card q-py-lg col" />
            <q-skeleton width="50%" class="rounded-card q-py-lg col q-ml-sm" />
          </q-card-actions>
        </q-card>
      <product-card
          v-else
          :product="product"
      />
  </q-page>
</template>

<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ProductCard from 'src/components/ProductCard.vue'
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  components: { ProductCard },
  name: 'ProductPage',
  setup() {
    const route = useRoute()
    const { id } = route.params

    const { result, loading } = useQuery(gql`
      query getProductById($productId: ID!) {
        getProductById(id: $productId) {
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
    `, {
      productId: id
    })

    const  product = computed(() => result.value?.getProductById)

    return {
      product,
      loading,
      result
    }
  }
})
</script>
