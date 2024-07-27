<script setup lang="ts">
import type { PublicationsResponse } from "@/types/pb";

const props = defineProps<{
  publication: PublicationsResponse;
}>();

const emit = defineEmits<{
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

      <PublicationEdit :publication />
    </div>
  </USlideover>
</template>
