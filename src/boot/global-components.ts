import { boot } from 'quasar/wrappers';

interface GlobalComponents {
  [componentName: string]: any;
}

const globalComponentNames = [
  'action-button',
  'banner-install-app',
];

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
      const pascalCaseName = await toPascalCase(componentName)
      let componentsPath = '../../src/components'

      if (componentName.includes('page')) {
        componentsPath += '/Page'
      } else {
        componentsPath += '/common'
      }


      /* @vite-ignore */
      const module = await import(
        `${componentsPath}/${pascalCaseName}.vue`
      );

      globalComponents[componentName] = module.default;

      app.component(componentName, module.default);
    })
  );
});
