<script setup lang="ts">
import type { Record } from "pocketbase";

const data = ref();

const props = defineProps<{
  modelValue: boolean;
  publication: Partial<Record>;
}>();
defineEmits<{
  "update:modelValue": [value: boolean];
}>();

watchEffect(() => (data.value = props.publication));
</script>

<template>
  <USlideover
    :model-value="modelValue"
    @update:model-value="
      (value: boolean) => {
        $emit('update:modelValue', value);
      }
    "
  >
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Update</span>
        {{ data.name }}
      </AppH2>

      <form class="space-y-6" @submit.prevent="updatePublication(data)">
        <UFormGroup name="name" label="Name">
          <UInput v-model="data.name" />
        </UFormGroup>
        <UFormGroup name="volume" label="Volume">
          <UInput v-model="data.volume" />
        </UFormGroup>
        <UFormGroup name="digital" label="Digital">
          <UToggle v-model="data.digital" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" />
        </div>
      </form>
    </div>
  </USlideover>
</template>
