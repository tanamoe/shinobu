<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const { state } = useTitlePage();

const { data, pending } = await useLazyAsyncData(
  () => $pb.collection(Collections.Formats).getFullList(),
  {
    transform: (formats) =>
      formats.map(({ id, name }) => ({
        id,
        name,
      })),
    default: () => [],
  },
);

const selected = computed(
  () => data.value?.find((format) => state.value.format === format.id),
);
</script>

<template>
  <UFormGroup name="format" label="Format">
    <USelectMenu
      v-model="state.format"
      :options="data"
      :loading="pending"
      value-attribute="id"
      option-attribute="name"
      searchable
    >
      <template #label>
        <span v-if="selected">{{ selected.name }}</span>
        <span v-else>Select a format</span>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>
