<script setup lang="ts">
const { $pb } = useNuxtApp();
const meta = useMeta();

const model = defineModel<string>();

const publishers = computed(() =>
  meta.publishers.value.map((publisher) => ({
    value: publisher.id,
    label: publisher.name,
    avatar: publisher.logo
      ? {
          src: $pb.files.getUrl(publisher, publisher.logo, {
            thumb: "100x100",
          }),
        }
      : undefined,
  })),
);

const current = computed(() =>
  publishers.value.find((p) => model.value === p.value),
);
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="publishers"
    value-key="value"
    :avatar="current?.avatar"
  />
</template>
