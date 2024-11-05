<script setup lang="ts">
import {
  Collections,
  type AdditionalTitleNamesResponse,
  type AssetsResponse,
  type PublishersResponse,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";
import { joinURL } from "ufo";
import type { MetadataImages } from "~/types/common";

const { $pb } = useNuxtApp();
const route = useRoute();

const {
  data: title,
  status,
  refresh,
} = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getOne<
    TitlesResponse<
      unknown,
      {
        additionalTitleNames_via_title?: AdditionalTitleNamesResponse[];
        releases_via_title?: ReleasesResponse<{
          publisher: PublishersResponse;
          partner: PublishersResponse;
          front: AssetsResponse<MetadataImages>;
        }>[];
        defaultRelease?: ReleasesResponse<{
          front: AssetsResponse<MetadataImages>;
        }>;
      }
    >
  >(route.params.titleId as string, {
    expand:
      "additionalTitleNames_via_title, defaultRelease.front, releases_via_title.publisher, releases_via_title.partner, releases_via_title.front",
  }),
);

const releases = computed(() => title.value?.expand?.releases_via_title);
const image = computed(
  () => title.value?.expand?.defaultRelease?.expand?.front,
);

if (!title.value)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });

useHead({
  title: title.value.name,
});
</script>

<template>
  <div v-if="title" class="p-6">
    <UBreadcrumb
      class="mb-6"
      :links="[
        { label: 'Title', to: '/title', icon: 'i-fluent-book-20-filled' },
        { label: title.name, to: `/title/${title.id}` },
      ]"
    />

    <section class="flex gap-6">
      <div class="flex-1 space-y-12">
        <TitleDetails :title="title" @change="refresh()" />

        <div
          class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <AppRelease
            v-for="release in releases"
            :key="release.id"
            :title
            :release
            :publisher="release.expand?.publisher"
            :partner="release.expand?.partner"
            :image="release.expand?.front"
            wide
          />
        </div>

        <div class="flex gap-6">
          <TitleLinks class="flex-1" :title="title" />
          <TitleWorks class="flex-1" :title="title" />
          <TitleAdditionalNames class="flex-1" :title @change="refresh" />
        </div>
      </div>
      <div class="space-y-3">
        <AppImageCover
          class="max-w-sm rounded"
          :name="title.expand?.defaultRelease?.name"
          :src="image && $pb.files.getUrl(image, image.image)"
          :srcset="image && image.resizedImage"
          aspect="full"
        />

        <UButton
          :to="joinURL('https://tana.moe/title/', title.slug)"
          target="_blank"
          color="gray"
          icon="i-fluent-window-arrow-up-20-filled"
          block
        >
          Preview
        </UButton>
      </div>
    </section>
  </div>
</template>
