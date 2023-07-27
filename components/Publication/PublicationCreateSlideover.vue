<script setup lang="ts">
import { type ReleaseResponse } from "@/types/pb";

const { isLoading, execute: createPublication } = useCreatePublication();

const props = defineProps<{
  modelValue: boolean;
  release: ReleaseResponse;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleCreate = async (e: Event) => {
  const formData = new FormData(e.target as HTMLFormElement);

  formData.append("release", props.release.id);

  await createPublication(0, formData);
  isOpen.value = !isOpen.value;
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
          <UInput />
        </UFormGroup>
        <UFormGroup name="volume" label="Volume">
          <UInput />
        </UFormGroup>
        <UFormGroup name="digital" label="Digital">
          <UToggle />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="isLoading" />
        </div>
      </form>
    </div>
  </USlideover>
</template>
