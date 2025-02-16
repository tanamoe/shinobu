<script setup lang="ts">
import type { ReleasesResponse, TitlesResponse } from "@/types/pb";

const slideover = useSlideover();

defineProps<{
  title?: TitlesResponse;
  release?: ReleasesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

function change() {
  slideover.close();
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
