<template>
  <q-page padding>
    <q-list
      v-for="(orderDate, i) in Object.keys(orders)"
      bordered
      class="rounded-borders"
      :key="i"
    >
      <q-expansion-item
        expand-separator
        class="text-bold text-uppercase text-grey-14 text-h7"
        icon="mdi-file-document-outline"
        default-opened
        :label="orderDate"
      >
      <q-separator spaced inset />

      <q-list separator>
         <q-item v-for="(order, idx) in orders[orderDate]" :key="idx" class="q-py-md text-subtitle2">
            <q-item-section class="flex">
              <q-item-label class="text-deep-blue-14">
                {{ date.formatDate(new Date(+order.createdAt), 'dddd, HH:mm:ss')}}
              </q-item-label>
              <q-item-label class="text-h6 text-black">
                {{ order.products.reduce((acc: any, el: any) => acc + el.amount, 0).toFixed(2).replace('.', ',') }}€
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
                <q-btn @click="handleView(order)" icon="mdi-eye" flat size="12px" class="q-pa-none" color="blue-grey-14" rounded />
            </q-item-section>
          </q-item>
      </q-list>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from 'vue';
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { date, useQuasar } from 'quasar'
import { Order, Orders } from '../components/models'
import OrderDialog from '../components/common/OrderDialog.vue'

export default defineComponent({
  name: 'OrdersPage',
  setup() {
    const $q = useQuasar()
    const { result } = useQuery(gql`
      query getMyOrders {
        getMyOrders {
          id
          createdAt
          status
          products {
            amount
            quantity
            product {
              id
              name
              price
              imagen
              accessories
              urlImage
              description
            }
          }
        }
      }
    `)

    const handleView = ({ products }: Order) => {
      $q.dialog({
        title: 'Positioned',
        position: 'bottom',
        component: OrderDialog,
        componentProps: { products }
      }).onDismiss(() => {
        console.log('dismissed')
      })
    }

    return {
      date,
      handleView,
      orders: computed(() => {
        const ordersObject: Orders = {}

        result.value?.getMyOrders.forEach((el: Order) => {
          const formatDate = (newDate: number) =>
            date.formatDate(newDate, 'YYYY - MMMM')
          const formattedDate = formatDate(+el.createdAt) // Formatear la fecha actual

          if (!ordersObject[formattedDate]) {
            ordersObject[formattedDate] = []
          }
          ordersObject[formattedDate].push(el) // Agregar la orden al arreglo correspondiente
        })

        return ordersObject
      })
    }
  }
})
</script>
