<template>
  <q-page padding>
        <div v-if="loading || !products" class="row q-col-gutter-x-sm q-gutter-y-lg justify-center">
          <div
            v-for="productCard in 15"
            :key="productCard"
            class="col-6 col-sm-6 col-md-4 col-lg-4"
          >
              <q-card class="border-radius-md q-px-sm">
                <q-card-section class="q-pb-none">
                  <q-skeleton height="90px" width="100%" />
                </q-card-section>
                <q-card-section class="q-py-none">
                  <q-skeleton type="text" height="80px" class="border-radius-sm" />
                  <q-skeleton type="text" height="60px" />
                </q-card-section>
                <q-card-section class="q-py-none">
                  <q-skeleton type="text" width="90px" class="q-ml-auto" />
                  <q-skeleton type="text" height="60px" />
                </q-card-section>
              </q-card>
          </div>
        </div>
        <div class="row  q-col-gutter-x-sm q-gutter-y-lg justify-center">
          <div v-for="product in products" class="border-radius-md col-6 col-sm-6 col-md-4 col-lg-4 " :key="product.id">
              <product-category :product="product" />
          </div>
        </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'

import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import useAuth from 'src/composables/useAuth'
import useCloudinaryImage from 'src/composables/useCloudinaryImage'
import ProductCategory from 'src/components/ProductCategory.vue'

export default defineComponent({
  name: 'CategoryPage',
  components: { ProductCategory },
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
            price
            imagen
            stock
            description
            uuid
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

    return {
      products: computed(() => result.value?.getProductsByCategory),
      loading: computed(() => loading.value || productsLoading.value),
      url: process.env.IMAGES_URL,
      useCloudinaryImage,
      productsLoading,
      categoryName,
      image: ref<null | string>(null),
    }
  },
})
</script>
