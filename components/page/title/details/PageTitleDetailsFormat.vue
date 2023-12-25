<script setup lang="ts">
const { formats } = useMeta();
const state = useTitlePage();

const data = computed(() =>
  formats.value.map(({ id, name }) => ({
    id,
    name,
  })),
);

const selected = computed(
  () => data.value?.find((format) => state.value.format === format.id),
);
</script>

<template>
  <UFormGroup name="format" label="Format">
    <USelectMenu
      v-model="state.format"
      :options="data"
      value-attribute="id"
      option-attribute="name"
      searchable
    >
      <template #label>
        <span v-if="selected">{{ selected.name }}</span>
        <span v-else>Select a format</span>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>
