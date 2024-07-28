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
  <USlideover v-if="publication">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Update</span>
        {{ publication.name }}
      </AppH2>

      <PublicationEdit :publication @change="$emit('change')" />
    </div>
  </USlideover>
</template>
