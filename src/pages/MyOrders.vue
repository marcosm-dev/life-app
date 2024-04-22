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
        class="text-blue-grey-14 text-bold"
        icon="mdi-file-document-outline"
        default-opened
        :label="orderDate"
      >
      <q-separator spaced inset />

      <q-list separator>
         <q-item v-for="(order, idx) in orders[orderDate]" :key="idx" class="q-py-md">
            <q-item-section class="flex">
              <q-item-label class="text-deep-orange-14">
                {{ date.formatDate(new Date(+order.createdAt), 'dddd, HH:mm:ss')}}
              </q-item-label>
              <q-item-label class="text-h6 text-black">
                {{ order.products.reduce((acc, el) => acc + el.amount, 0).toFixed(2).replace('.', ',') }}€
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
                <q-btn @click="handleView(order)" icon="mdi-eye" flat size="12px" class="q-pa-none" color="blue-grey-14" rounded />
            </q-item-section>
          </q-item>
      </q-list>
      <!-- <q-card>
        <q-card-section class="q-pa-sm">
          <q-item
            v-for="(product, i) in orders[order][0].products"
            :key="i"
            clickable
            class="bg-grey-1"
          >
            <q-item-section>
              <q-item-label>
                {{ product.product.name }}
              </q-item-label>
              <q-item-label caption>
                {{ product.product.price.toFixed(2).replace('.', ',') }} €
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label class="flex items-center">
                <h4 class="text-subtitle1 q-ma-none q-pr-sm">Total:</h4>
                {{ product.amount }} €
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card> -->

      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect } from 'vue';
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import { date, useQuasar } from 'quasar'
import { Order, Orders } from '../components/models';
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
            product {
              id
              name
              price
              imagen
              accessories
              urlImage
              description
              brand {
                image
              }
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

    watchEffect(() => {
      console.log(result.value)
    })

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

        console.log(ordersObject)

        return ordersObject
      })
    }
  }
})
</script>
