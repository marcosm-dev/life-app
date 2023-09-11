import { useQuasar } from 'quasar'
import { reactive, watchEffect } from 'vue';

import CustomDialogComponent from 'components/common/CustomDialogComponent.vue'

const useCustomDialog = (props: any) => {
  const $q = useQuasar()
  const state = reactive({
    open: false
  })
  function toggleCustomDialog(val: boolean) {
    console.log(props)
    if (val) state.open = val
   else {
     state.open = !state.open
   }

    if (state.open) {
      $q.dialog({
        title: 'Positioned',
        position: 'bottom',
        component: CustomDialogComponent,
        componentProps: {
          ...props,
        }
      }).onDismiss(() => toggleCustomDialog(false))
    }
  }

  return {
    state,
    toggleCustomDialog
  }
}
export default useCustomDialog
