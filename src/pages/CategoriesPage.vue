<template>
  <div
    class="row justify-center q-mx-md"
    :class="$q.screen.width < 768 ? 'q-mx-md' : 'q-col-gutter-md'"
  >
    <h5 class="col-12 text-bold q-mx-auto text-center text-h6">
      ¿Qué tipo de producto buscas?
    </h5>
    <template v-if="loading">
      <div
        v-for="skeleton in 8"
        :key="skeleton"
        class="col-12 col-md-4 col-sm-6 col-lg-2"
      >
        <q-card
          style="min-height: 210px;"
          class="cursor-pointer q-mb-md q-mt-md text-center q-mx-auto rounded-card shadow-10 q-pt-sm"
        >
          <q-card-section class="row justify-center">
              <q-skeleton width="250px" height="150px">
              </q-skeleton>
          </q-card-section>
          <q-skeleton class="absolute-bottom q-pt-lg flex" style="border-radius: 5px 5px 26px 26px" >
            <q-skeleton class="q-mb-lg q-ml-md" width="40%" />
          </q-skeleton>
        </q-card>
      </div>
    </template>
    <div
      v-else
      v-scroll="onScroll"
      v-for="category in categories"
      ref="itemsRefs"
      :key="category.id"
      class="col-12 col-md-4 col-sm-6 col-lg-2"
      :class="$q.screen.gt.xs ? 'q-px-md' : ''"
    >
        <q-card
          class="cursor-pointer q-mb-md q-mt-md text-center q-mx-auto rounded-card shadow-10 q-pt-sm"
          bordered
          @click="$router.push(`/categories/${category.id}`)"
        >
          <q-card-section class="transparent q-pa-none">
            <q-img
              style="rgb(155.155.155,0.1)"
              :src="`${url}/categories/${category.urlImage}`"
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
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const $q = useQuasar()
    const itemsRefs = ref([])
    const limit = ref($q.screen.gt.sm ? 4 : 8)
    const url = process.env.IMAGES_URL
    if ($q.platform.is.desktop) limit.value = 15


    const { result, loading, fetchMore } = useQuery(gql`
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
    }))
    const categories = computed(() => result.value?.getAllCategories)

    async function loadMore () {
      fetchMore({
        variables: {
          skip: result.value.getAllCategories.length,
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
              ...fetchMoreResult.getAllCategories,
            ],
          }
        },
      })
    }


    return {
        onScroll: async() => {
            const scrolledHeight = Math.round(window.scrollY + window.innerHeight);
            const totalHeight = Math.round(document.documentElement.scrollHeight);

            if (scrolledHeight === totalHeight && !loading.value) {
              await loadMore();
            }
        },
        loading,
        categories,
        loadMore,
        itemsRefs,
        url,
    }
  },
})
</script>
