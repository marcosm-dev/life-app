import { useQuasar, format } from 'quasar'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import * as manifest from '../../src-pwa/manifest.json'

import CustomDialogComponent from 'components/common/CustomDialogComponent.vue'
import { Product } from 'components/models'
import useAuth from './useAuth'

export interface IDialogProps {
  type?: string
  action?: string
  subtitle?: string
  title: string
  dense?: boolean
  placeHolder?: string
  successMessage?: string
  description?: string
  disclaimer?: string
  product?: Product
}

interface IDialogConstant {
  [key: string]: IDialogProps
}
const { name } = manifest

const useCustomDialog = (type = 'password', product?: Product) => {
  const { user } = useAuth()
  const { t } = useI18n()
  const { capitalize } = format

  const DIALOGS: IDialogConstant = {
    password: {
      type: 'password',
      action: 'update',
      title: t('dialogs.recovery.title'),
      dense: true,
      placeHolder: t('dialogs.recovery.oldPassword')
    },
    request: {
      type: 'request',
      title: t('dialogs.product.title', {
        name: product?.name?.toLowerCase()
      }),
      subtitle: t('dialogs.product.subtitle'),
      product
    },
    stock: {
      type: 'stock',
      title: t('dialogs.custom.noStock.title', {
        name: capitalize(user.value.name?.toLowerCase() ?? '')
      }),
      subtitle: t('dialogs.custom.noStock.subtitle', { name: product?.name }),
      product
    },
    recovery: {
      type: 'password',
      action: 'recovery',
      dense: true,
      placeHolder: t('recovery.placeHolder'),
      title: t('recovery.title'),
      subtitle: t('recovery.subtitle', { name }),
      description: t('recovery.description'),
      disclaimer: t('recovery.disclaimer')
    }
  }

  const $q = useQuasar()
  const state = reactive({
    open: false
  })
  function toggleCustomDialog(val: boolean = state.open) {
    const componentProps = DIALOGS[type]

    if (val) state.open = val
    else {
      state.open = !state.open
    }

    if (state.open) {
      $q.dialog({
        title: 'Positioned',
        position: 'bottom',
        component: CustomDialogComponent,
        componentProps
      }).onDismiss(() => toggleCustomDialog(false))
    }
  }

  return {
    state,
    toggleCustomDialog
  }
}
export default useCustomDialog
