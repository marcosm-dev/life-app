<template>
   <q-btn
      type="submit"
      :text-color="textColor ?? 'black'"
      :label="label"
      no-caps
      outline
      dense
      padding="20px"
      :color="color ?? ''"
      :loading="loading"
    >
       <transition
          enter-active-class="animated flipInX"
        >
        <slot name="badge" />
        </transition>
    </q-btn>
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
