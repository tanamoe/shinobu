<script setup lang="ts">
import type {
  AssetsResponse,
  ReleasesResponse,
  TitlesResponse,
} from "@/types/pb";
import type { MetadataImages } from "~/types/common";

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
  <USlideover>
    <div class="p-6">
      <AppH2 v-if="release">
        <span class="text-zinc-400">Edit release</span>
        {{ release.name }}
      </AppH2>
      <AppH2 v-else-if="title">
        <span class="text-zinc-400">Create a release for</span>
        {{ title.name }}
      </AppH2>

      <FormRelease :title :release @change="change" />
    </div>
  </USlideover>
</template>
