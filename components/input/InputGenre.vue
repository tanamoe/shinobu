<script setup lang="ts">
const meta = useMeta();

const genres = computed(() =>
  meta.genres.value.map(({ id, name }) => ({
    value: id,
    label: name,
  })),
);

const model = defineModel<string | string[]>({ required: true });
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="genres"
    placeholder="Select a demographic"
    value-key="value"
    searchable
    :multiple="Array.isArray(model)"
  />
</template>
