import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'AuthLayout',
    path: '/auth',
    redirect: '/auth/sign-in',
    meta: {
      transition: 'slideInLeft',
      requiresAuth: true
    },
    component: () =>
      import(/* webpackChunkName: "group-user" */ 'layouts/AuthLayout.vue'),
    children: [
      {
        name: 'AuthPage',
        path: '/auth/sign-in',
        meta: {
          transition: 'slideInLeft',
          requiresAuth: true
        },
        component: () =>
          import(/* webpackChunkName: "group-user" */ 'pages/AuthPage.vue')
      }
    ]
  },
  {
    name: 'HomeLayout',
    path: '/',
    alias: '/home',
    meta: {
      transition: 'slideInLeft',
      transitionLeave: 'slideInLeft',
      requiresAuth: true
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'Redirect', path: '', redirect: '/categories' },
      {
        name: 'Categories',
        path: '/categories',
        meta: {
          transition: 'slideInRight',
          requiresAuth: true
        },
        component: () => import('pages/CategoriesPage.vue')
      },
      {
        name: 'Category',
        path: '/category/:id',
        meta: {
          //   transition: 'fadeIn',
          requiresAuth: true
        },
        component: () => import('pages/CategoryPage.vue')
      },
      {
        name: 'Manuales',
        path: '/manuales',
        meta: {
          //   transition: 'fadeIn',
          requiresAuth: true
        },
        component: () => import('pages/ManualesPage.vue')
      },
      {
        name: 'Contacto',
        path: '/contacto',
        // meta: {
        //   transition: 'fadeIn',
        //   requiresAuth: true
        // },
        component: () => import('pages/ContactoPage.vue')
      },
      {
        name: 'UserOrders',
        path: '/orders',
        // meta: {
        //   transition: 'fadeIn',
        //   requiresAuth: true
        // },
        component: () =>
          import(/* webpackChunkName: "group-user" */ 'pages/MyOrders.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
