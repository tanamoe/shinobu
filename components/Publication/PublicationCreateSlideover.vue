<script setup lang="ts">
import { type ReleaseResponse } from "@/types/pb";

const { pending, create } = usePublication();

const props = defineProps<{
  modelValue: boolean;
  release: ReleaseResponse;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [void];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const state = ref({
  name: "",
  volume: 0,
  digital: false,
});

const handleCreate = async () => {
  await create({
    release: props.release.id,
    ...state.value,
  });
  isOpen.value = false;
  emit("change");
};
</script>

<template>
  <USlideover v-model="isOpen">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Create a publication for</span>
        {{ release.name }}
      </AppH2>

      <form class="space-y-6" @submit.prevent="handleCreate">
        <UFormGroup name="name" label="Name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup name="volume" label="Volume">
          <UInput v-model="state.volume" />
        </UFormGroup>
        <UFormGroup name="digital" label="Digital">
          <UToggle v-model="state.digital" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </form>
    </div>
  </USlideover>
</template>
