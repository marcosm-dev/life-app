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
        <div class="row q-col-gutter-x-sm q-gutter-y-lg justify-center">
          <div v-for="product in products" class="border-radius-md col-6 col-sm-6 col-md-4 col-lg-4" :key="product.id">
              <q-card
                class="border-radius-md q-px-sm q-pb-sm bg-grey-1"
                bordered
                flat
                outline
              >
                <q-icon
                  class="cart-heart"
                  size="24px"
                  color="blue-grey-13"
                  name="mdi-heart-outline"
                />
                  <q-card-section class="border-radius-sm">
                      <q-img
                        :src="`${url}/productos/${product.imagen}`"
                        height="90px"
                        fit="scale-down"
                      >
                          <template #error>
                            <q-img
                               src="src/assets/logo.jpg"
                              fit="scale-down"
                              class="bg-transparent"
                            />
                          </template>
                        </q-img>
                  </q-card-section>
                  <q-card-section class="q-gutter-y-sm no-padding">
                    <div class="text-subtitle1 knockout full-width q-pa-sm border-radius-sm text-grey-10 bg-lime-14">
                        {{ product.name }}
                    </div>
                    <div class="text-caption border-radius-sm text-blue-grey-10 q-px-sm">
                        {{ product.description.toLowerCase() }}.
                    </div>
                </q-card-section>

                <q-card-actions class="flex justify-end no-padding q-mt-md">
                      <div class="bg-lime-13 text-grey-10 text-bold q-pa-sm border-radius-sm col-12 flex items-end">
                          <div class="q-ml-auto flex text-right">
                              {{ product.price.toFixed(2).replace('.', ',') }}
                            <small class="block q-mr-auto q-mx-sm text-caption">EUR</small>
                          </div>
                      </div>
                      <div v-if="product.stock < 10" class="text-bold text-accent text-overline q-py-xs">
                          Quedan {{ product.stock }} {{  product.stock > 1 ? 'Uds' : 'Ud' }}.
                      </div>
                    <div class="full-width q-pa-sm">
                          <action-button
                          :to="`/product/${product.id}`"
                          class="text-no-wrap full-width"
                          neutro
                          padding="5px 20px"
                          label="Ver producto"
                        />
                    </div>
                </q-card-actions>
            </q-card>
            <!-- <ProductCard  :product="product"  /> -->
          </div>
        </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect, Ref } from 'vue';
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
            imagen
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
