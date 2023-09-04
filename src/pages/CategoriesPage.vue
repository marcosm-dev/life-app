<template>
  <q-page padding>
    <template v-if="loading
">
      <q-card
        v-for="skeleton in 4"
        :key="skeleton"
        class="q-col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer q-mb-md q-mt-md rounded-card shadow-10 q-pt-sm"
      >
        <q-card-section class="row justify-center">
          <q-skeleton width="250px" height="150px"> </q-skeleton>
          <q-skeleton
            class="absolute-bottom flex"
            style="border-radius: 5px 5px 26px 26px"
          >
            <q-skeleton class="q-mb-lg q-ml-md" width="40%" />
          </q-skeleton>
        </q-card-section>
      </q-card>
    </template>
    <div
      v-else
      v-scroll="onScroll"
      class="row q-col-gutter-x-md q-col-gutter-y-lg"
    >
      <div
        v-for="category in categories"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        :key="category.id"
      >
        <q-card
          class="cursor-pointer rounded-card shadow-10 category-card"
          @click="$router.push(`/category/${category.id}`)"
          bordered
        >
          <q-card-section class="transparent q-pa-none">
            <q-img
              :src="`${url}/categories/${category.urlImage}`"
              height="200px"
              fit="fill"
            >
              <div
                class="absolute-bottom flex justify-between"
                style="border-radius: 5px 5px 26px 26px"
              >
<<<<<<< HEAD
                <q-card-section class="transparent q-pa-none">
                  <q-img
                    style="rgb(155.155.155,0.1)"
                    :src="`${url}/categorias/${category.urlImage}`"
                    height="200px"
                    fit="fill"
                  >
                    <div class="absolute-bottom flex justify-between" style="border-radius: 5px 5px 26px 26px">
                      <div class="text-h6 text-white">
                        {{ category.name }}
                      </div>
                      <transition
                          name="arrow-left"
                          appear
                          appear-active-class="animated slideInLeft"
                        >
                        <q-icon
                          class="transition-arrow"
                          color="white"
                          size="30px"
                          name="mdi-arrow-right"
                        />
                      </transition>
                      </div>
                  </q-img>
                  <!-- <q-img
=======
                <div class="text-h6" style="text-transform: none;">
                  {{ category.name }}
                </div>
                <transition
                  name="arrow-left"
                  appear
                  appear-active-class="animated slideInLeft"
                >
                  <q-icon
                    class="transition-arrow"
                    color="white"
                    size="30px"
                    name="mdi-arrow-right"
                  />
                </transition>
              </div>
            </q-img>
            <!-- <q-img
>>>>>>> v1
                    class="bg-blue-grey-3"
                    :src="`${url}/categories/${category.urlImage}`"
                    style="max-height: 160px !important; border: 2px double rgb(0,0,0,0.3)"
                    fit="contain"
                    fetchpriority="high"
                    :ratio="1"
                  /> -->
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const $q = useQuasar()
    const limit = ref($q.screen.gt.sm ? 4 : 8)
    const url = process.env.IMAGES_URL
    if ($q.platform.is.desktop) limit.value = 15

<<<<<<< HEAD
    const { result, loading, fetchMore } = useQuery(gql`
      query getAllCategories($limit: Int!, $skip: Int!) {
        getAllCategories(limit: $limit, skip: $skip) {
          id
          urlImage
          name
=======
    const { result, loading, fetchMore } = useQuery(
      gql`
        query getAllCategories($limit: Int!, $skip: Int!) {
          getAllCategories(limit: $limit, skip: $skip) {
            id
            urlImage
            name
          }
>>>>>>> v1
        }
      `,
      () => ({
        limit: limit.value,
        skip: 0
      })
    )
    const categories = computed(() => result.value?.getAllCategories)

    async function loadMore() {
      fetchMore({
        variables: {
          skip: result.value.getAllCategories.length
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          // No new feed posts
          if (!fetchMoreResult) {
            return previousResult
          }

          // Revisar desactivar query sino hay mas productos
          // if(result.value.getAllCategories.length === categories.value.length) {
          // }

          // Concat previous feed with new feed posts
          return {
            ...previousResult,
            getAllCategories: [
              ...previousResult.getAllCategories,
              ...fetchMoreResult.getAllCategories
            ]
          }
        }
      })
    }

    return {
      onScroll: async () => {
        const scrolledHeight = Math.round(window.scrollY + window.innerHeight)
        const totalHeight = Math.round(document.documentElement.scrollHeight)

        if (scrolledHeight === totalHeight && !loading.value) {
          await loadMore()
        }
      },
      loading,
      categories,
      loadMore,
      url
    }
  }
})
</script>

