import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'account-signin',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '/', component: () => import('pages/AuthPage.vue') }],
  },
  {
    path: '/home',
    meta: {
      requiresAuth: true,
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/home',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/category/:name',
        component: () => import('pages/CategoryPage.vue')
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
