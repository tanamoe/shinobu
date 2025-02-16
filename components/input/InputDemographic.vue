<script setup lang="ts">
const meta = useMeta();

const demographics = computed(() =>
  meta.demographics.value.map(({ id, name }) => ({
    value: id,
    label: name,
  })),
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="demographics"
    placeholder="Select a demographic"
    value-key="value"
    searchable
  />
</template>
