<script setup lang="ts">
const meta = useMeta();

const formats = computed(() =>
  meta.formats.value.map(({ id, name }) => ({
    value: id,
    label: name,
  })),
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="formats"
    placeholder="Select a format"
    value-key="value"
    searchable
  />
</template>
