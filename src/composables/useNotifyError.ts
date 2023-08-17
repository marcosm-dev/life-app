import { Notify } from 'quasar'; // Asegúrate de importar QNotification si es necesario
import { NotifyError } from 'components/models';

const useNotifyError = ({ message, html }: NotifyError) => {
  console.log(message)
    Notify.create({
      message: message,
      color: 'light-blue-1',
      textColor: 'dark'
    });


};

export default useNotifyError;
