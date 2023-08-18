<template>
  <q-page padding class="q-pb-xl">
    <h5 class="text-bold q-mx-auto text-center text-h6">
      ¿Qué tipo de producto buscas?
    </h5>
    <router-view v-slot="{ Component }">
      <template v-if="Component">
        <Transition mode="out-in">
          <KeepAlive>
            <Suspense>
              <!-- main content -->
              <component :is="Component"></component>

              <!-- loading state -->
              <template #fallback>
                <div class="q-pa-md">
                  <div class="q-gutter-md">
                    <q-skeleton type="circle" size="100px" />
                    <q-skeleton width="150px" />
                    <q-skeleton height="150px" />
                    <q-skeleton size="50px" />
                    <q-skeleton width="200px" height="100px" />
                  </div>
                </div>
              </template>
            </Suspense>
          </KeepAlive>
        </Transition>
  </template>
    </router-view>
  </q-page>
</template>

