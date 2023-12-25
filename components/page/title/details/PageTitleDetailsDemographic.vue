<script setup lang="ts">
const { demographics } = useMeta();
const state = useTitlePage();

const data = computed(() =>
  demographics.value.map(({ id, name }) => ({
    id,
    name,
  })),
);

const selected = computed(() =>
  data.value.find((demographic) => state.value.demographic === demographic.id),
);
</script>

<template>
  <UFormGroup name="demographic" label="Demographic">
    <USelectMenu
      v-model="state.demographic"
      :options="data"
      value-attribute="id"
      option-attribute="name"
      searchable
    >
      <template #label>
        <span v-if="selected">{{ selected.name }}</span>
        <span v-else>Select a demographic</span>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>
