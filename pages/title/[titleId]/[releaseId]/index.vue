<script setup lang="ts">
import {
  Collections,
  type AssetsResponse,
  type AssetTypesResponse,
  type BookMetadataResponse,
  type BooksResponse,
  type PublicationsResponse,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { MetadataImages } from "~/types/common";

const { $pb } = useNuxtApp();
const route = useRoute();

const { data: release, refresh } = await useAsyncData(
  route.params.releaseId as string,
  () =>
    $pb.collection(Collections.Releases).getOne<
      ReleasesResponse<{
        title: TitlesResponse;
        front: AssetsResponse<MetadataImages>;
        banner: AssetsResponse<MetadataImages>;
        logo: AssetsResponse<MetadataImages>;
        publications_via_release: PublicationsResponse<
          unknown,
          {
            books_via_publication?: BooksResponse<
              unknown,
              {
                assets_via_book?: AssetsResponse<
                  MetadataImages,
                  { type: AssetTypesResponse }
                >[];
                bookMetadata_via_book?: BookMetadataResponse;
              }
            >[];
          }
        >[];
      }>
    >(route.params.releaseId as string, {
      expand:
        "title, front, banner, logo, publications_via_release.books_via_publication.assets_via_book.type, publications_via_release.books_via_publication.bookMetadata_via_book",
    }),
);

if (!release.value?.expand?.title)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });

useHead({
  title: release.value.name,
});
</script>

<template>
  <div v-if="release && release.expand?.title" class="p-6 space-y-6">
    <UBreadcrumb
      class="mb-6"
      :links="[
        { label: 'Title', to: '/title', icon: 'i-fluent-book-20-filled' },
        { label: release.expand?.title.name, to: `/title/${release.title}` },
        { label: release.name, to: `/title/${release.title}/${release.id}` },
      ]"
    />

    <div class="flex gap-6">
      <FormRelease class="flex-1" :release @change="refresh" />
      <FormReleaseFront
        :release
        :front="release.expand?.front"
        @change="refresh"
      />
    </div>

    <UDivider />

    <AppPublications
      :publications="release.expand?.publications_via_release"
      :release
      @change="refresh"
    />
  </div>
</template>
