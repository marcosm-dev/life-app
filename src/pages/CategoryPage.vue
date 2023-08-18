<template>
  <q-page>
    <h4 class="row justify-around q-px-md">
      {{ category }}
    </h4>
    <div class="row justify-center" v-if="products?.length && !loading">
        <ProductCard
          class="q-mx-sm col-sm-8 col-12 col-lg-4 col-md-6"
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
    </div>
    <template v-else>
      <div v-for="skeleton in 4" class="justify-center q-px-sm full-width col" :key="skeleton">
        <transition
          appear
          enter-active-class="animated fadeIn"
        >
          <q-card
          class="q-mb-lg shadow-12 rounded-card"
              :class="$q.screen.width < 768 ? 'column' : 'row'"
              style="min-height: 500px;"
            >
              <q-card-section class="column">
                <q-skeleton width="170px" height="100px" class="rounded-card col-12" />
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
                  <q-skeleton class="col-auto"  width="127px"/>
                  <q-skeleton width="20px"/>
                  <q-skeleton class="col-auto" width="127px" />
                </q-card-section>

                <q-separator class="col-12" size="1px" inset />

                <q-card-actions class="row q-pa-md">
                  <q-skeleton width="50%" class="rounded-card q-py-lg col" />
                  <q-skeleton width="50%" class="rounded-card q-py-lg col q-ml-sm" />
                </q-card-actions>
        </q-card>
        </transition>
      </div>
    </template>
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
      query getCategory ($id: ID!) {
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


    return {
      products: computed(() => result.value?.getProductsByCategory),
      category: computed(() => categoryResult.value?.getCategoryById.name),
      productsLoading,
      loading: computed(() => loading.value || productsLoading.value),
    };
  },
  components: {
    ProductCard
  }
})
</script>
