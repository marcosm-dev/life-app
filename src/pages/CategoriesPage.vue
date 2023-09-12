<template>
  <q-page padding>
    <div class="row q-col-gutter-x-sm  q-col-gutter-y-lg">
      <template  v-if="loading && !categories" >
        <div
          v-for="skeleton in 10"
          class="col-6 col-sm-6 col-md-4 col-lg-3"
          :key="skeleton"
        >
          <q-card class="cursor-pointer shadow-10 category-card bg-transparent border-radius-md shadow-15">
            <q-card-section class="row justify-center">
              <q-skeleton width="250px" height="100px"> </q-skeleton>
              <q-skeleton
                class="absolute-bottom flex"
                style="border-radius: 5px 5px 26px 26px"
              >
                <q-skeleton class="q-my-sm q-ml-md" width="40%" />
                <q-skeleton class="q-my-sm q-ml-auto q-mr-md" width="10%" />
              </q-skeleton>
            </q-card-section>
          </q-card>
        </div>
      </template>
      <template v-else>
        <div
          v-for="category in categories"
          class="col-6 col-sm-6 col-md-6 col-lg-4"
          :key="category.id"
        >
          <q-card
            class="cursor-pointer shadow-10 category-card bg-transparent border-radius-md shadow-15"
            @click="$router.push(`/category/${category.id}`)"
            bordered
          >
            <q-card-section class="transparent row justify-center">
              <q-img
                    :src="`${url}/productos/${category.urlImage}`"
                    :height="!$q.screen.gt.sm ? '100px' : '200px'"
                    fit="scale-down"
                    fetchpriority="high"
                  />
              <div
                  class="absolute-bottom flex justify-between q-px-md bg-primary text-grey-1 text-no-wrap no-wrap"
                  style="border-radius: 2px 2px 26px 26px; padding: 10px 14px"
                >
                  <div class="text-lime-13" style="text-transform: none">
                    {{ category.name }}
                  </div>
                  <transition
                    name="arrow-left"
                    appear
                    appear-active-class="animated slideInLeft"
                  >
                    <q-icon
                      class="transition-arrow q-ml-auto"
                      color="white"
                      size="20px"
                      name="mdi-arrow-right"
                    />
                  </transition>
                </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useQuasar } from 'quasar';
import { onBeforeRouteLeave } from 'vue-router';
import useAuth from 'src/composables/useAuth';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const { store } = useAuth()
    const $q = useQuasar()
    const limit = ref($q.screen.gt.sm ? 8 : 10)
    const url = process.env.IMAGES_URL
    if ($q.platform.is.desktop) limit.value = 15
    store.title = '¿Qué estás buscando?'

    const { result, fetchMore, loading } = useQuery(gql`
        query getAllCategories($limit: Int!, $skip: Int!) {
          getAllCategories(limit: $limit, skip: $skip) {
            id
            urlImage
            name
          }
        }
      `, () => ({
        limit: limit.value,
        skip: 0,
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
          if (!fetchMoreResult.getAllCategories.length) {
            return previousResult
          }
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

    onBeforeRouteLeave(() =>{
      store.title = ''
    })

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

<style lang="scss">
.category-cover {
  width: 100%;
  height: 100%;
}
.category-card {
  height: 100%;
}
</style>
