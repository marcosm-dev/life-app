import { Notify, format } from 'quasar' // Asegúrate de importar QNotification si es necesario
import { NotifyError } from 'components/models'

const useNotifyError = ({ message, html, icon = 'mdi-alert-outline', iconColor = 'accent' }: NotifyError) => {
  Notify.create({
    message: format.capitalize(message),
    color: 'white',
    textColor: 'dark',
    classes: 'text-lowercase border-radius-md q-pa-md',
    icon,
    iconColor,
    html
  })
}

export default useNotifyError
