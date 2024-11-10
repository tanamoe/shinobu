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
  book: BooksResponse;
  publication: PublicationsResponse;
  metadata?: BookMetadataResponse;
  assets?: AssetsResponse<MetadataImages, { type: AssetTypesResponse }>[];
}>();

defineEmits<{
  change: [];
}>();

const ui = {
  width: "max-w-2xl",
};
</script>

<template>
  <USlideover :ui>
    <div class="p-6 overflow-y-scroll">
      <AppH2>
        {{ publication.name }}
        <span class="text-zinc-400">books</span>
      </AppH2>

      <BookEdit
        :book
        :publication
        :metadata
        :assets
        @change="$emit('change')"
      />
    </div>
  </USlideover>
</template>
