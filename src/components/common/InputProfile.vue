<template>
   <label :for="label" class="full-width">
        {{ label }}
     <q-input
        :name="label"
        class="q-pt-xs input-profile text-caption"
        :model-value="modelValue"
        rounded
        dense
        autogrow
        standout
        outlined
        :bg-color="!edit ? 'lime-13' : ''"
        :readonly="edit"
      >
        <!-- <template v-if="icon" #prepend>
            <q-icon :name="`mdi-${icon}-circle-outline`" color="blue-grey" />
        </template> -->
        <template v-if="icon" #append>
            <q-icon
              @click="edit = !edit"
              style="opacity: 0.5;"
              color="blue-grey-4"
              name="mdi-pencil-circle-outline"
            />
        </template>
      </q-input>
    </label>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps(['modelValue', 'label', 'icon', 'no-edit'])
const edit = ref(true)

</script>

<style lang="scss">
.input-profile .q-field__inner .q-field__control {
  border-radius: 18px;
}
</style>
