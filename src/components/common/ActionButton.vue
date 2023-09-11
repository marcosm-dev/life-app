<template>
  <q-btn
    :text-color="neutro ? 'grey-8' : 'info'"
    :label="label"
    no-caps
    outline
    dense
    rounded
    :padding="padding ?? '15px'"
    :loading="loading"
  >
    <transition enter-active-class="animated flipInX">
      <slot name="badge" />
    </transition>
    <slot name="icon" />

    <slot name="label" />
    <slot name="extra" />
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    padding: {
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    neutro: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    }
  },
  name: 'ActionButton',
  setup() {
    return {}
  }
})
</script>
