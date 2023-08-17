<template>
  <q-page padding class="q-pb-xl">
    <h5 class="text-bold q-mx-auto text-center text-h6">
      ¿Qué tipo de producto buscas?
    </h5>
    <div
      class="row justify-center q-mx-md"
      :class="$q.screen.width < 768 ? 'q-mx-md' : 'q-col-gutter-md'"
    >
      <div
        v-scroll="onScroll"
        v-for="category in categories"
        ref="itemsRefs"
        :key="category.id"
        class="col-12 col-md-4 col-sm-6 col-lg-2"
      >
          <q-card
            class="cursor-pointer q-mb-md q-mt-md text-center q-mx-auto"
            bordered
            @click="$router.push(`/category/${category.name}?categoryId=${category.id}`)"
          >
            <q-card-section class="transparent q-pa-xs">
              <q-img
                style="rgb(155.155.155,0.1)"
                :src="`${url}/categories/${category.urlImage}`"
                height="200px"
                fit="fill"
              >
                <div class="absolute-bottom flex justify-between">
                  <div class="text-h6 text-light-blue-1">
                    {{ category.name }}
                  </div>
                  <q-icon
                    color="light-blue-1"
                    size="30px"
                    name="mdi-arrow-right"
                  />
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
  </q-page>
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
        categories,
        loadMore,
        itemsRefs,
        url,
    }
  },
})
</script>
