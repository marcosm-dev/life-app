import { useQuasar } from 'quasar'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import CustomDialogComponent from 'components/common/CustomDialogComponent.vue'

const useCustomDialog = (props: any) => {
  const { t } = useI18n()
  const passwordDialogOptions = {
    type: 'password',
    action: 'update',
    title: t('dialogs.recovery.title'),
    dense: true,
    placeHolder: t('dialogs.recovery.oldPassword')
  }

  const dialogProps = typeof props === 'string' ? passwordDialogOptions  :  { ...props }

  const $q = useQuasar()
  const state = reactive({
    open: false
  })
  function toggleCustomDialog(val: boolean = state.open) {
    if (val) state.open = val
   else {
     state.open = !state.open
   }

    if (state.open) {
      $q.dialog({
        title: 'Positioned',
        position: 'bottom',
        component: CustomDialogComponent,
        componentProps: dialogProps
      }).onDismiss(() => toggleCustomDialog(false))
    }
  }

  return {
    state,
    toggleCustomDialog
  }
}
export default useCustomDialog
