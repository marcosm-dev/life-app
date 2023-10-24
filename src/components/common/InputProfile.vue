<template>
   <label :for="label" class="full-width">
        {{ label }}:
     <q-input
        :for="label"
        :name="label"
        class="q-pt-xs input-profile text-caption"
        :model-value="modelValue ?? '----------------------------------------------------'"
        dense
        outlined
        color="info"
        :readonly="!readonly"
        :clearable="!label.includes('uuid')"
      >
        <!-- <template v-if="icon" #prepend>
            <q-icon :name="`mdi-${icon}-circle-outline`" color="blue-grey" />
        </template> -->
        <!-- <template v-if="icon" #append>
            <q-icon
              @click="edit = !edit"
              style="opacity: 0.5;"
              color="blue-grey-4"
              name="mdi-pencil-circle-outline"
            />
        </template> -->
      </q-input>
    </label>
</template>

<script setup lang="ts">
// import { reactive } from 'vue';
defineProps(['modelValue', 'label', 'icon', 'no-edit', 'readonly'])

// const editState = reactive({
//   personal: false,
//   address: false
// })

</script>

<style lang="scss">
.input-profile .q-field__inner .q-field__control {
  border-radius: 8px;
}
</style>
