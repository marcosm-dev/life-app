import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

// Create I18n instance
const i18n = createI18n({
  locale: 'es-ES',
  legacy: false,
  fallbackLocale: 'es-ES',
  globalInjection: true
});

export default boot(({ app }) => {
  // Tell app to use the I18n instance
  app.use(i18n);
});
