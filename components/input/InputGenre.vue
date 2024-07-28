<script setup lang="ts">
const { genres } = useMeta();

const model = defineModel<string | string[]>({ required: true });
</script>

<template>
  <USelectMenu
    v-model="model"
    :options="genres"
    placeholder="Select a demographic"
    value-attribute="id"
    option-attribute="name"
    searchable
  />
</template>
