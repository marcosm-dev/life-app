<template>
  <q-page padding>
    <div class="justify-center q-px-sm row"  v-if="productsLoading || loading">
      <transition appear enter-active-class="animated fadeIn">
        <q-card
          class="column q-mx-sm col-sm-8 col-12 col-lg-4 col-md-6 q-mb-lg shadow-12 rounded-card"
          style="min-height: 500px"
        >
          <q-card-section class="column">
            <q-skeleton
              width="170px"
              height="100px"
              class="rounded-card col-12"
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

          <q-separator class="col-12" size="1px" inset />

          <q-card-actions class="row q-pa-md">
            <q-skeleton width="50%" class="rounded-card q-py-lg col" />
            <q-skeleton width="50%" class="rounded-card q-py-lg col q-ml-sm" />
          </q-card-actions>
        </q-card>
      </transition>
    </div>
    <div class="row q-col-gutter-md justify-center" v-else>
      <div v-for="product in products" class="col-12 col-sm-6 col-md-4 col-lg-4" :key="product.id">
        <ProductCard  :product="product"  />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

import ProductCard from 'components/ProductCard.vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { useMeta } from 'quasar'
import useAuth from 'src/composables/useAuth'

export default defineComponent({
  name: 'CategoryPage',
  setup() {
    const { store } = useAuth()
    const route = useRoute()
    const categoryName = ref(null)
    const { id } = route.params

    const { result: categoryResult, loading } = useQuery(
      gql`
        query getCategory($id: ID!) {
          getCategoryById(id: $id) {
            id
            name
          }
        }
      `,
      {
        id
      }
    )

    const { result, loading: productsLoading } = useQuery(
      gql`
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
      `,
      () => ({
        id
      })
    )

    watchEffect(() => {
      if (result.value && categoryResult.value) {
        const { name } = categoryResult.value?.getCategoryById
        categoryName.value = name
        store.title = name

      }
    })

     useMeta(() => {
          return {
            title: `Serpica Canarias ${
              categoryName.value ? `-${categoryName.value}` : ''
            }`,
          }
        })

    onBeforeRouteLeave(() =>{
      store.title = '¿Que tipo de producto buscas?'
    })

    return {
      products: computed(() => result.value?.getProductsByCategory),
      loading: computed(() => loading.value || productsLoading.value),
      productsLoading,
      categoryName
    }
  },
  components: {
    ProductCard
  }
})
</script>
