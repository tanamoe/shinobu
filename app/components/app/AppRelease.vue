<script setup lang="ts">
import type {
  FormatsResponse,
  TitlesResponse,
  PublishersResponse,
  ReleasesResponse,
  AssetsResponse,
} from "@/types/pb";
import type { MetadataImages } from "@/types/common";
import { joinURL } from "ufo";
import type { CardProps } from "@nuxt/ui";

defineProps<{
  release: Pick<ReleasesResponse, "id" | "name" | "disambiguation" | "digital">;
  title: Pick<TitlesResponse, "slug" | "defaultRelease">;
  image?: AssetsResponse<MetadataImages>;
  publisher?: Pick<PublishersResponse, "collectionId" | "id" | "name" | "logo">;
  partner?: Pick<PublishersResponse, "collectionId" | "id" | "name" | "logo">;
  wide?: boolean;
  sizes?: string;
  draggable?: boolean;
}>();

const ui: CardProps["ui"] = {
  root: "relative overflow-hidden",
  body: "p-0 sm:p-0 shadow grid grid-cols-2 ",
};
</script>

<template>
  <NuxtLink
    :to="joinURL('/title', title.slug, release.id)"
    class="group h-auto w-full"
    :draggable
  >
    <UCard :ui>
      <AppImageCover
        class="transition-all group-hover:brightness-90 dark:group-hover:brightness-75"
        :name="release.name"
        :src="image && $pb.files.getUrl(image, image.image)"
        :srcset="image && image.resizedImage"
        :sizes
        :draggable
      />
      <div class="p-4 flex flex-col">
        <div class="flex-1 space-y-1">
          <div
            v-if="release.digital || partner || publisher"
            class="flex flex-wrap items-center gap-1"
          >
            <UBadge v-if="release.digital" color="secondary">Digital</UBadge>
            <UBadge v-if="partner" color="neutral" variant="subtle">
              <AppPublisher :publisher="partner" />
            </UBadge>
            <UBadge v-if="publisher" color="neutral" variant="subtle">
              <AppPublisher :publisher />
            </UBadge>
            <UBadge v-if="title.defaultRelease == release.id" color="primary">
              Default
            </UBadge>
          </div>

          <h3
            class="decoration-primary-400 line-clamp-4 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline mt-3"
          >
            {{ release.name }}
          </h3>
          <p v-if="release.disambiguation">{{ release.disambiguation }}</p>
        </div>

        <slot name="after" />
      </div>
    </UCard>
  </NuxtLink>
</template>
