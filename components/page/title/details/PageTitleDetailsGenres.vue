<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const { state } = useTitlePage();

const { data, pending } = await useLazyAsyncData(
  () => $pb.collection(Collections.Genres).getFullList(),
  {
    transform: (genres) =>
      genres.map(({ id, name }) => ({
        id,
        name,
      })),
    default: () => [],
  },
);

const selected = computed(
  () => data.value?.filter((genre) => state.value.genres.includes(genre.id)),
);
</script>

<template>
  <UFormGroup name="genres" label="Genres">
    <USelectMenu
      v-model="state.genres"
      :options="data"
      :loading="pending"
      value-attribute="id"
      option-attribute="name"
      multiple
      searchable
    >
      <template #label>
        <span v-if="selected && selected.length > 0">
          {{ selected.map((genre) => genre.name).join(", ") }}
        </span>
        <span v-else>None genres selected</span>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>
