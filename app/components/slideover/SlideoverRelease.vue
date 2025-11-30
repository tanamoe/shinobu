<script setup lang="ts">
import type { ReleasesResponse, TitlesResponse } from "@/types/pb";

defineProps<{
  title?: TitlesResponse;
  release?: ReleasesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

function change() {
  emit("change");
}
</script>

<template>
  <USlideover
    :title="
      release
        ? `Edit release ${release.name}`
        : title
          ? `Create a release for ${title.name}`
          : ''
    "
  >
    <template #body>
      <FormRelease :title :release @change="change" />
    </template>
  </USlideover>
</template>
