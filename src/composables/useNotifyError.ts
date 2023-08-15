import { Notify } from 'quasar'; // Asegúrate de importar QNotification si es necesario
import { NotifyError } from 'components/models';

const useNotifyError = () => {
  const notifyError = ({ message, html }: NotifyError) => {
    const baseNotify = Notify.create({
      message: message,
      color: 'light-blue-14',
      textColor: 'dark'
    });

    return baseNotify;
  };

  return {
    notifyError
  };
};

export default useNotifyError;
