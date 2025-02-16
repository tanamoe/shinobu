<script setup lang="ts">
import type { PublicationsResponse } from "@/types/pb";

defineProps<{
  publication: PublicationsResponse;
}>();

defineEmits<{
  change: [];
}>();
</script>

<template>
  <USlideover :title="`Update ${publication.name}`">
    <template #body>
      <FormPublication :publication @change="$emit('change')" />
    </template>
  </USlideover>
</template>
