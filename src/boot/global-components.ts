import { boot } from 'quasar/wrappers';

const globalComponents: any = {
  'action-button': await import('components/common/ActionButton.vue')
};

export default boot(async ({ app }) => {
  for (const key in globalComponents) {
    app.component(key, globalComponents[key].default);
  }
});
