<template>
  <q-page padding>
        <div v-if="resultLoading || searchLoading && !products" class="row q-col-gutter-x-sm q-gutter-y-lg justify-center">
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
import { defineComponent, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'

import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import useAuth from 'src/composables/useAuth'
import useCloudinaryImage from 'src/composables/useCloudinaryImage'
import ProductCategory from 'src/components/ProductCategory.vue'
import { Product } from '../components/models'

export default defineComponent({
  name: 'CategoryPage',
  components: { ProductCategory },
  setup() {
    const { store, loading } = useAuth()
    const route = useRoute()
    const categoryName = ref(null)
    const products = ref<Product[] | null>(null)
    const { id } = route.params
    const search = id.toString()
   const enabled = ref(false)

      const { result, loading: resultLoading } = useQuery(gql`
        query getProductsByCategory($id: ID!) {
            getProductsByCategory(categoryId: $id) {
              id
              urlImage
              name
              price
              brand {
                id
                name
              }
              categoryId {
                id
                name
              }
              imagen
              stock
              description
              uuid
            }
          }
        `, () => ({
          id
        }),
        () => ({ enabled: !enabled.value })
      )

      const { result: searchResult, loading: searchLoading } = useQuery(gql`
        query searchProductsByText($text: String) {
          searchProductsByText(text: $text) {
              id
              urlImage
              name
              price
              brand {
                id
                name
              }
              categoryId {
                id
                name
              }
              imagen
              stock
              description
              uuid
          }
        },
      `, () => ({
        text: search.split(':')[1]
      }), () => ({
        enabled: enabled.value,
      }))

      watchEffect(() => {
        if (id.includes('search')) {
          enabled.value = true
        } else {
          enabled.value = false
        }

        if (result.value) {
          const { name } = result.value.getProductsByCategory[0].categoryId
          categoryName.value = name
          store.title = name
          products.value = result.value.getProductsByCategory
          loading.value = false
        }
        if (searchResult.value) {
          products.value = searchResult.value.searchProductsByText
          loading.value = false
        }
    })

    useMeta(() => {
          return {
            title: `Serpica Canarias ${categoryName.value ? `- ${categoryName.value}` : ' '}`,
          }
      })

    return {
      products,
      resultLoading,
      searchLoading,
      url: process.env.IMAGES_URL,
      useCloudinaryImage,
      categoryName,
      image: ref<null | string>(null),
    }
  },
})
</script>
