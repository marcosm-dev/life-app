<template>
     <AdvancedImage
        :cldImg="useCloudinaryImage(image, folder)"
        :plugins="plugins"
     />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  AdvancedImage,
  lazyload,
} from '@cloudinary/vue'
import useCloudinaryImage from 'src/composables/useCloudinaryImage';

export default defineComponent({
  components: { AdvancedImage  },
  name: 'ClodinaryImage',
  props: ['image', 'folder'],
  setup() {
    const plugins = [lazyload()];

    return {
      plugins,
      useCloudinaryImage,
    }
  }
})
</script>
