<template>
  <q-page padding>
    <q-card-section>
          <!-- @click="dialogRef.hide(); success = false" -->
        <q-btn
          no-caps
          padding="10px 20px"
          text-color="positive"
          style="background: rgb(0,0,0,.3)"
          flat
          square
          ripple
        >
              <div class="text-body1 knockout">
                  {{ $q.lang.label.close }}
                  <div class="text-body text-dark-page knockout" style="color: rgb(255,255,255,.75)">
                      {{ 0 }}
                  </div>
              </div>
        </q-btn>
    </q-card-section>
    <q-list v-for="(order, i) in Object.keys(orders)[0]?.split('/')" bordered class="rounded-borders" :key="i">
      <q-expansion-item
        expand-separator
        class="text-blue-grey-14"
        icon="mdi-file-document-outline"
        :label="date.formatDate(Object.keys(orders)[0], 'MMMM YYYY')"
        default-opened
      >
        <pre>{{ Object.keys(orders)[0].split('/') }}</pre>
      <q-expansion-item switch-toggle-side dense-toggle label="Today">
            <q-card>

            </q-card>
        </q-expansion-item>
    </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

import { date } from 'quasar';
import { Order, Orders } from '../components/models';

export default defineComponent({
  name: 'OrdersPage',
  setup() {
    const { result, loading } = useQuery(gql`
      query getMyOrders {
        getMyOrders {
          id
          createdAt
          status
          products {
            amount
            product {
              id
              name
              price
              accessories
            }
          }
        }
      }
    `)

    return {
      date,
      orders: computed(() => {
        const ordersObject: Orders = {};

        result.value?.getMyOrders.forEach((el: Order) => {
          const formatDate = (newDate: number) => date.formatDate(newDate, 'YYYY/MM');

          const formattedDate = formatDate(+el.createdAt); // Formatear la fecha actual

          if (!ordersObject[formattedDate]) {
            ordersObject[formattedDate] = [];
          }

          ordersObject[formattedDate].push(el); // Agregar la orden al arreglo correspondiente
        });

        console.log(ordersObject)

        return ordersObject;
      }),
    };
  },
});
</script>
