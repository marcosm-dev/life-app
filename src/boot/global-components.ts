import { boot } from 'quasar/wrappers';

interface GlobalComponents {
  [componentName: string]: any;
}

const globalComponentNames = ['action-button', 'banner-install-app'];

const globalComponents: GlobalComponents = {};

async function toPascalCase(str: string) {
  return str
    .split('-')
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export default boot(async ({ app }) => {
  Promise.allSettled([
    globalComponentNames.map(async (componentName) => {
      const pascalCaseName = await toPascalCase(componentName);

      let module;

      const importUrl = `../components/common/${pascalCaseName}.vue`;

      if (pascalCaseName) module = await import(importUrl);

      globalComponents[componentName] = module.default;

      app.component(componentName, module.default);
    })
  ]);

  console.log(globalComponents);

  // Verificar que los componentes se hayan agregado correctamente
});
