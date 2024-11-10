<script setup lang="ts">
import type { AssetsResponse, AssetTypesResponse } from "@/types/pb";
import type { MetadataImages } from "~/types/common";

defineProps<{
  asset: AssetsResponse<MetadataImages>;
  type?: AssetTypesResponse;
  strikethrough?: boolean;
}>();

defineEmits<{
  toggle: [AssetsResponse];
}>();
</script>

<template>
  <div
    class="flex gap-3 items-center"
    :class="{ 'brightness-50': strikethrough }"
  >
    <AppImage
      :src="$pb.files.getUrl(asset, asset.image, { thumb: '100x100' })"
      :srcset="asset.resizedImage"
      class="rounded w-32 object-contain aspect-[2/3] bg-gray-200 dark:bg-gray-800"
    />
    <div
      class="overflow-hidden whitespace-nowrap text-ellipsis flex-1 space-y-3"
      :class="{ 'line-through': strikethrough }"
    >
      <div>{{ asset.priority }}. {{ asset.image }}</div>
      <div>
        <UBadge v-if="type">{{ type.name }}</UBadge>
      </div>
      <p v-if="asset.description">
        {{ asset.description }}
      </p>
    </div>
    <UButton
      variant="ghost"
      :icon="
        strikethrough
          ? 'i-fluent-delete-arrow-back-20-filled'
          : 'i-fluent-delete-20-filled'
      "
      color="red"
      square
      @click="$emit('toggle', asset)"
    />
  </div>
</template>
