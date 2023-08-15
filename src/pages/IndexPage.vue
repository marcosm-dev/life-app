<template>
  <q-page padding class="q-pb-xl">
    <h5 class="text-bold q-mx-auto text-center text-h6">
      ¿Qué tipo de producto buscas?
    </h5>
    <div
      class="row q-mx-md"
      :class="$q.screen.width < 768 ? 'q-mx-md' : 'q-col-gutter-md'"
    >
      <div
        v-scroll="onScroll"
        v-for="category in categories"
        ref="itemsRefs"
        :key="category.id"
        class="col-12 col-md-6 col-lg-4"
      >
          <q-card
            class="cursor-pointer q-mb-md q-mt-md text-center shadow-10 q-mx-lg"
            style="background: rgb(255,255,255, 0.9);"
            @click="$router.push(`/category/${category.name}?categoryId=${category.id}`)"
          >
            <q-card-section class="transparent q-px-lg">
              <q-img
                class="rounded-borders bg-dark-page"
                :src="`${url}/categories/${category.urlImage}`"
                fit="contain"
                style="border-radius: 15px important;"
                fetchpriority="high"
                :ratio="16/9"
              />
            </q-card-section>
            <q-card-actions class="justify-center q-pb-lg">
               <action-button
                  :label="category.name"
                />
            </q-card-actions>
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
    const limit = ref(4)
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
