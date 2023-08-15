import { boot } from 'quasar/wrappers';
/* @vite-ignore */
interface GlobalComponents {
  [componentName: string]: any;
}

const globalComponentNames = ['action-button'];
const globalComponents: GlobalComponents = {};

async function toPascalCase(str: string) {
  return str
    .split('-')
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
export default boot(async ({ app }) => {
  await Promise.all(
    globalComponentNames.map(async (componentName) => {
      const pascalCaseName = toPascalCase(componentName);
      const module = await import('components/common/ActionButton.vue');

      globalComponents[componentName] = module.default;
      app.component(componentName, module.default);
    })
  );

  console.log(globalComponents); // Verificar que los componentes se hayan agregado correctamente
});
