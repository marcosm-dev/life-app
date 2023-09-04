import { Notify, format } from 'quasar' // Asegúrate de importar QNotification si es necesario
import { NotifyError } from 'components/models'

const useNotifyError = ({ message, html }: NotifyError) => {
  Notify.create({
    message: format.capitalize(message),
    color: 'light-blue-1',
    textColor: 'dark',
    classes: 'text-lowercase',
    icon: 'mdi-alert-outline',
    iconColor: 'accent'
  })
}

export default useNotifyError
