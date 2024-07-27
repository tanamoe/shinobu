<script setup lang="ts">
import type { AssetsResponse } from "@/types/pb";

defineProps<{
  assets: AssetsResponse[];
}>();

const modelValue = defineModel<string[]>("removeFiles", { required: true });

function toggle(file: string) {
  if (modelValue.value.includes(file)) {
    modelValue.value = modelValue.value.filter((f) => f !== file);
  } else {
    modelValue.value.push(file);
  }
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="asset in assets"
      :key="asset.id"
      class="flex gap-3 items-center"
      :class="{ 'brightness-50': modelValue.includes(asset.id) }"
    >
      <img
        :src="$pb.files.getUrl(asset, asset.image, { thumb: '100x100' })"
        class="flex-shrink-0 w-12 rounded"
      />
      <div
        class="overflow-hidden whitespace-nowrap text-ellipsis flex-1"
        :class="{ 'line-through': modelValue.includes(asset.id) }"
      >
        {{ asset.image }}
      </div>
      <UButton
        variant="ghost"
        :icon="
          modelValue.includes(asset.id)
            ? 'i-fluent-delete-arrow-back-20-filled'
            : 'i-fluent-delete-20-filled'
        "
        color="red"
        square
        @click="toggle(asset.id)"
      />
    </div>
  </div>
</template>
