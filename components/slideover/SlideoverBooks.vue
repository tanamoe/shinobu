<script setup lang="ts">
import {
  Collections,
  type AssetsResponse,
  type BooksResponse,
  type BookMetadataResponse,
  type PublicationsResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();

const props = defineProps<{
  publication: PublicationsResponse;
}>();

const { data, status, refresh } = await useLazyAsyncData(
  () =>
    $pb.collection(Collections.Books).getFullList<
      BooksResponse<
        unknown,
        {
          assets_via_book?: AssetsResponse[];
          bookMetadata_via_book?: BookMetadataResponse;
        }
      >
    >({
      filter: $pb.filter("publication.id = {:publication}", {
        publication: props.publication.id,
      }),
      expand: "assets_via_book,bookMetadata_via_book",
    }),
  {
    watch: [props.publication],
    transform: (data) =>
      data.map((book) => ({
        ...book,
        // remove timestamp
        publishDate: book.publishDate.split(" ")[0],
      })),
  },
);
</script>

<template>
  <USlideover>
    <div class="p-6 overflow-y-scroll">
      <AppH2>
        {{ publication.name }}
        <span class="text-zinc-400">books</span>
      </AppH2>

      <div v-if="status == 'pending'">
        <UCard class="space-y-6">
          <div class="space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
        </UCard>
      </div>

      <div v-else-if="data" class="space-y-6">
        <UCard v-for="book in data">
          <BookEdit :book="book" @change="refresh" />
        </UCard>

        <PageReleaseBookCreate @change="refresh" />
      </div>
    </div>
  </USlideover>
</template>
