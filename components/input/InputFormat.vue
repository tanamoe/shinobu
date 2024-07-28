<script setup lang="ts">
const { formats } = useMeta();

const model = defineModel<string>({ required: true });
</script>

<template>
  <USelectMenu
    v-model="model"
    :options="formats"
    placeholder="Select a demographic"
    value-attribute="id"
    option-attribute="name"
    searchable
  />
</template>
