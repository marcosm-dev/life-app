import { Notify } from 'quasar'; // Asegúrate de importar QNotification si es necesario
import { NotifyError } from 'components/models';

const useNotifyError = ({ message, html }: NotifyError) => {
    Notify.create({
      message: message,
      color: 'light-blue-1',
      textColor: 'dark',
      closeBtn: true,
      classes: 'text-capitalize',
      icon: 'mdi-exclamation-thick',
    })


};

export default useNotifyError;
