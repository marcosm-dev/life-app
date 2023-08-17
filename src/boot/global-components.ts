import { boot } from 'quasar/wrappers'

interface GlobalComponents {
  [componentName: string]: any
}



// async function toPascalCase(str: string) {
//   return str
//     .split('-')
//     .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
//     .join('')
// }

export default boot(async ({ app }) => {
  const globalComponentNames: GlobalComponents = {
    'action-button': await import('components/common/ActionButton.vue'),
    'banner-install-app': await import('components/common/BannerInstallApp.vue'),
  }

  for (const component in globalComponentNames) {
    app.component(component, globalComponentNames[component].default)
  }

})
