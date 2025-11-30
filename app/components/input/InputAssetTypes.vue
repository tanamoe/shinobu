<script setup lang="ts">
const meta = useMeta();

const assetTypes = computed(() =>
  meta.assetTypes.value.map(({ id, name }) => ({
    value: id,
    label: name,
  })),
);

const selected = defineModel<string>({ required: true });
</script>

<template>
  <USelect v-model="selected" :items="assetTypes" />
</template>
