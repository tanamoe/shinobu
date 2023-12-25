<script setup lang="ts">
const { genres } = useMeta();
const state = useTitlePage();

const data = computed(() =>
  genres.value.map(({ id, name }) => ({
    id,
    name,
  })),
);

const selected = computed(
  () => data.value?.filter((genre) => state.value.genres.includes(genre.id)),
);
</script>

<template>
  <UFormGroup name="genres" label="Genres">
    <USelectMenu
      v-model="state.genres"
      :options="data"
      value-attribute="id"
      option-attribute="name"
      multiple
      searchable
    >
      <template #label>
        <span v-if="selected && selected.length > 0">
          {{ selected.map((genre) => genre.name).join(", ") }}
        </span>
        <span v-else>None genres selected</span>
      </template>
    </USelectMenu>
  </UFormGroup>
</template>
