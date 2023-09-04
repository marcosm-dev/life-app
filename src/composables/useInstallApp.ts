import { onBeforeMount } from 'vue'
import { BeforeInstallPromptEvent } from 'src/components/models'
import useAuth from './useAuth'

const useInstallApp = () => {
  const { deferredPrompt } = useAuth()

  const beforeInstallHandler = async (e: Event) => {
    // Verificar si el evento es realmente un BeforeInstallPromptEvent
    if ((e as BeforeInstallPromptEvent).platforms) {
      const beforeInstallPromptEvent = e as BeforeInstallPromptEvent
      // Previene a la mini barra de información que aparezca en smartphones
      // e.preventDefault();
      // Guarda el evento para que se dispare más tarde
      deferredPrompt.value = beforeInstallPromptEvent
      console.log(beforeInstallPromptEvent)
      // Actualizar la IU para notificarle al usuario que se puede instalar tu PWA
      // showInstallPromotion();
      // De manera opcional, envía el evento de analíticos para saber si se mostró la promoción a a instalación del PWA
      console.log('beforeinstallpromp event was fired')
    }
  }
  onBeforeMount(() => {
    window.addEventListener('beforeinstallprompt', beforeInstallHandler)
    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null
      console.log('PWA was installed')
    })
  })
}

export default useInstallApp
