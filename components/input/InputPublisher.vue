<script setup lang="ts">
const { $pb } = useNuxtApp();
const { publishers } = useMeta();

const model = defineModel<string>();

const current = computed(() =>
  publishers.value.find((p) => model.value === p.id),
);
</script>

<template>
  <USelectMenu
    v-model="model"
    :options="publishers"
    value-attribute="id"
    option-attribute="name"
  >
    <template #label>
      <template v-if="current">
        <UAvatar
          :src="$pb.files.getUrl(current, current.logo, { thumb: '100x100' })"
          size="2xs"
        />
        <span>{{ current.name }}</span>
      </template>
    </template>
  </USelectMenu>
</template>
