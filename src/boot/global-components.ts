import { boot } from 'quasar/wrappers'
import ActionButton from 'components/common/ActionButton.vue'
import BannerInstallApp from 'components/common/BannerInstallApp.vue'

export default boot(async ({ app }) => {

  app.component('action-button', ActionButton)
  app.component('banner-install-app', BannerInstallApp)

})
