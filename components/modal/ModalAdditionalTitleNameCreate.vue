<script setup lang="ts">
import type { TitlesResponse } from "@/types/pb";

defineProps<{
  title: TitlesResponse;
}>();

const open = ref(false);
</script>

<template>
  <UModal v-model:open="open" title="Additional names">
    <template #body>
      <FormAdditionalName :title @change="open = false" />
    </template>
  </UModal>
</template>
