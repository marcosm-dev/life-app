import { boot } from 'quasar/wrappers';

interface GlobalComponents {
  [componentName: string]: any;
}

const globalComponentNames = ['action-button'];
const globalComponents: GlobalComponents = {};

function toPascalCase(str: string) {
  return str
    .split('-')
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export default boot(async ({ app }) => {
  globalComponentNames.map(async (componentName) => {
    const pascalCaseName = await toPascalCase(componentName);
    const module = await import(`components/common/${pascalCaseName}.vue`);

    console.log(globalComponents);
    globalComponents[componentName] = module.default;
    app.component(componentName, module.default);
  });
});
