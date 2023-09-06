<template>
  <q-page padding>
        <div class="justify-center q-px-sm row"  v-if="productsLoading || loading">

        </div>
        <div class="row q-col-gutter-sm justify-center" v-else>
          <div v-for="product in products" class="border-radius-md col-6 col-sm-6 col-md-4 col-lg-4" :key="product.id">
              <q-card
                class="border-radius-md full-height column"
                bordered
                flat
                outline
              >
                <!-- <q-icon
                  class="cart-heart"
                  size="24px"
                  color="blue-grey-13"
                  name="mdi-heart-outline"
                /> -->
                <q-card-section class="no-padding col-auto">
                    <q-card-section class="flex flex-center q-py-sm">
                          <cloudinary-image
                            class="fit"
                            folder="productos"
                            :image="product.name"
                            />
                    </q-card-section>
                    <q-card-section class="q-gutter-y-sm q-py-none">
                      <div class="text-subtitle1 knockout bg-blue-grey-1 full-width q-pa-sm border-radius-sm text-blue-grey-10">
                          {{ product.name }}
                      </div>
                      <div class="text-caption  bg-blue-grey-1 border-radius-sm text-blue-grey-10  q-py-md q-px-sm">
                          {{ product.description.toLowerCase() }}.
                      </div>
                  </q-card-section>
                </q-card-section>

                <q-card-actions class="row q-pa-md q-mt-auto justify-end ">
                      <div class="bg-lime-13 text-blue-grey-14 text-bold q-pa-sm border-radius-sm col-12 flex items-end">
                      <div class="q-ml-auto flex">
                          {{ product.price.toFixed(2) }}
                          <small class="block q-mr-auto q-mx-sm">EUR</small>
                      </div>
                  </div>
                    <div v-if="product.stock < 10" class="text-bold text-accent text-overline q-py-xs">
                        Quedan {{ product.stock }} {{  product.stock > 0 ? 'Uds' : 'Ud' }}.
                    </div>
                    <action-button
                      :to="`/product/${product.id}`"
                      class="text-no-wrap block col-12"
                      neutro
                      padding="5px 20px"
                      label="Ver producto"
                    />
                </q-card-actions>
            </q-card>
            <!-- <ProductCard  :product="product"  /> -->
          </div>
        </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { useMeta } from 'quasar'
import useAuth from 'src/composables/useAuth'
import ActionButton from 'src/components/common/ActionButton.vue'
import useCloudinaryImage from 'src/composables/useCloudinaryImage'

export default defineComponent({
  name: 'CategoryPage',
    components: {
    ActionButton,
  },
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
            stock
            description
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
      useCloudinaryImage,
      productsLoading,
      categoryName
    }
  },
})
</script>
