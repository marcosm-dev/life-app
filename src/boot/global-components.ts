import { boot } from 'quasar/wrappers'

const commonComponents = import.meta.glob('components/common/*.vue')

export default boot(async ({ app }) => {
  for (const fileName of Object.keys(commonComponents)) {
    const module = await commonComponents[fileName]()
    const componentName = fileName
      .split('/')
      .pop()
      ?.replace(/\.\w+$/, '') as string
    app.component(componentName, (module).default)
  }
})
