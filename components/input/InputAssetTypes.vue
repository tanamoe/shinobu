<script setup lang="ts">
const { assetTypes } = useMeta();

const selected = defineModel<string>({ required: true });
</script>

<template>
  <USelect
    v-model="selected"
    :options="assetTypes"
    value-attribute="id"
    option-attribute="name"
  />
</template>
