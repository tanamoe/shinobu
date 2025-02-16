<script setup lang="ts">
import type {
  AssetsResponse,
  BooksResponse,
  BookMetadataResponse,
  PublicationsResponse,
  AssetTypesResponse,
} from "@/types/pb";
import type { MetadataImages } from "~/types/common";

defineProps<{
  book?: BooksResponse;
  publication: PublicationsResponse;
  metadata?: BookMetadataResponse;
  assets?: AssetsResponse<MetadataImages, { type: AssetTypesResponse }>[];
}>();

defineEmits<{
  change: [];
}>();
</script>

<template>
  <USlideover
    :title="publication.name"
    :description="book?.id === publication.defaultBook ? 'Default' : ''"
  >
    <template #body>
      <BookEdit
        v-if="book"
        :book
        :publication
        :metadata
        :assets
        @change="$emit('change')"
      />

      <BookCreate v-else :publication @change="$emit('change')" />
    </template>
  </USlideover>
</template>
