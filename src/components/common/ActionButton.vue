<template>
   <q-btn
      type="submit"
      padding="5px 20px"
      :text-color="textColor ?? 'black'"
      :label="label"
      no-caps
      outline
      dense
      :color="color ?? ''"
      :loading="loading"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['loading', 'label', 'color', 'textColor'],
  name: 'ActionButton',
  setup() {
    return {}
  }
})


</script>
