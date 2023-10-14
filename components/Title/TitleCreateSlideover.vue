<script setup lang="ts">
import { Collections, type FormatsResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { pending, create } = useTitle();

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [void];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const state = ref<{
  name: string;
  format?: string;
}>({
  name: "",
  format: undefined,
});

const { data: formats } = await useAsyncData(
  async () =>
    await $pb.collection(Collections.Formats).getFullList<FormatsResponse>(),
  {
    transform: (formats) =>
      formats.map((format) => ({
        value: format.id,
        label: format.name,
      })),
  },
);

const handleCreate = async () => {
  const res = await create(state.value);

  if (res) {
    emit("change");
    isOpen.value = false;
  }
};
</script>

<template>
  <USlideover v-model="isOpen">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Create a title</span>
      </AppH2>

      <form class="space-y-6" @submit.prevent="handleCreate">
        <UFormGroup label="Name">
          <UInput v-model="state.name" name="name" />
        </UFormGroup>
        <UFormGroup label="Format">
          <USelect
            v-model="state.format"
            :options="formats || []"
            name="format"
          />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </form>
    </div>
  </USlideover>
</template>
