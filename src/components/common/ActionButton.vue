<template>
   <q-btn
      type="submit"
      padding="5px 20px"
      text-color="blue-grey-13"
      :label="label"
      no-caps
      outline
      dense
      :loading="loading"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['loading', 'label'],
  name: 'ActionButton',
  setup() {
    return {}
  }
})


</script>
