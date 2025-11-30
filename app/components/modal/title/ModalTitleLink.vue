<script setup lang="ts">
import type { TitlesResponse } from "@/types/pb";

defineProps<{
  title: TitlesResponse;
}>();

defineEmits<{ close: [boolean] }>();
</script>

<template>
  <UModal :title="`Attach a source for ${title.name}`">
    <template #body>
      <FormTitleLink :title @change="$emit('close', true)" />
    </template>
  </UModal>
</template>
