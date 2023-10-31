<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const { state } = useTitlePage();

const { data, pending } = await useLazyAsyncData(
  () => $pb.collection(Collections.Demographics).getFullList(),
  {
    transform: (demographics) =>
      demographics.map(({ id, name }) => ({
        id,
        name,
      })),
    default: () => [],
  },
);

const selected = computed(
  () =>
    data.value?.find(
      (demographic) => state.value.demographic === demographic.id,
    ),
);
</script>

<template>
  <UFormGroup name="demographic" label="Demographic">
    <USelectMenu
      v-model="state.demographic"
      :options="data"
      :loading="pending"
      value-attribute="id"
      option-attribute="name"
      searchable
    >
      <template #label>
        <span v-if="selected">{{ selected.name }}</span>
        <span v-else>Select a demographic</span>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>
