<template>
  <q-page class="window-height bg-dark-page">
  <!-- Iframe for Life Manual -->
      <iframe
        ref="iframe"
        class="full-width full-height"
        src="https://www.homelife.it/es/download"
        frameborder="0"
        allowfullscreen
        :onload="iframeVisible"
      />
  </q-page>
</template>

<script lang="ts">
import { QSpinnerGears, useQuasar } from 'quasar';
import { onUnmounted, ref } from 'vue';

export default {
  name: 'LifeManualsPage',
  setup() {
    const $q = useQuasar();
    const iframeLoaded = ref(false);
    const iframe = ref(null);

    $q.loading.show({
      delay: 900,
      spinner: QSpinnerGears,
      spinnerColor: 'dark-page',
      backgroundColor: 'transparent',
    });

    async function iframeVisible(e: Event) {
      await new Promise((resolve, reject) => {
        if (e.isTrusted) resolve(e.isTrusted)
        else reject(e.isTrusted);
        iframeLoaded.value = e.isTrusted;
      })
      $q.loading.hide();
    }

    onUnmounted(() => {
      console.log('hola')
      $q.loading.hide();
    })

    return {
      iframe,
      iframeLoaded,
      iframeVisible,
    }
  }
}
</script>
