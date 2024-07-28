<script setup lang="ts">
const { demographics } = useMeta();

const model = defineModel<string>({ required: true });
</script>

<template>
  <USelectMenu
    v-model="model"
    :options="demographics"
    placeholder="Select a demographic"
    value-attribute="id"
    option-attribute="name"
    searchable
  />
</template>
