<script setup lang="ts">
import { Collections } from "~/types/pb";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [string];
}>();

const { $pb } = useNuxtApp();

const { data: publishers, pending } = await useLazyAsyncData(
  () => $pb.collection(Collections.Publishers).getFullList(),
  {
    transform: (publishers) =>
      publishers.map((publisher) => ({
        id: publisher.id,
        name: publisher.name,
        avatar:
          publisher.logo !== ""
            ? {
                src: $pb.getFileUrl(publisher, publisher.logo, {
                  thumb: "100x100",
                }),
              }
            : null,
      })),
  },
);

const publisher = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const current = computed(
  () => publishers.value?.find((p) => publisher.value === p.id),
);
</script>

<template>
  <USelectMenu
    v-model="publisher"
    :options="publishers || []"
    :loading="pending"
    value-attribute="id"
    option-attribute="name"
  >
    <template #label>
      <UAvatar v-bind="current?.avatar" size="2xs" />
      {{ current?.name }}
    </template>
  </USelectMenu>
</template>
