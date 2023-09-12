<template>
     <AdvancedImage
        :cldImg="cldImage"
        :plugins="plugins"
     />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  AdvancedImage,
  responsive,
} from '@cloudinary/vue'
import useCloudinaryImage from 'src/composables/useCloudinaryImage';

export default defineComponent({
  components: { AdvancedImage  },
  name: 'ClodinaryImage',
  props: ['image', 'folder'],
  setup(props) {
    const plugins = [responsive()]

    return {
      plugins,
      cldImage: useCloudinaryImage(props.image, props.folder)
    }
  }
})
</script>
