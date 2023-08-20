import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';

import routes from './routes';
import { useAuthStore } from 'src/stores/auth';
import useNotifyError from 'src/composables/useNotifyError';

/*
* If not building with SSR mode, you can
* directly export the Router instantiation;
*
* The function below can be async too; either use
* async/await or return a Promise which resolves
 * with the Router instance.
*/

export default route(function () {
  const store = useAuthStore()
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { left: 0, top: 0 }
      }
    },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });

  Router.beforeEach((to, from, next) => {
      const isAuthenticated = to.matched.some((record) => record.meta.requiresAuth) && store.authenticated

      if (to.name !== 'AuthPage' && !isAuthenticated) {
        useNotifyError({ message: 'No estas autenticado, por favor inicia sesión'  })
        next({ name: 'AuthPage' })
      }
      next()






  });

  return Router;
});
