<script setup lang="ts">
import type { MetadataImages } from "@/types/common";
import type {
  AssetsResponse,
  BooksResponse,
  PublicationsResponse,
} from "@/types/pb";

export interface AppBookProps {
  book: BooksResponse<
    unknown,
    {
      assets_via_book?: AssetsResponse<MetadataImages>[];
    }
  >;
  publication: PublicationsResponse;
  sizes?: string;
  wide?: boolean;
  draggable?: boolean;
  showButton?: boolean;
}

const props = withDefaults(defineProps<AppBookProps>(), {
  sizes: "(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw",
  wide: false,
});

defineEmits<{
  add: [];
}>();

const image = computed(() => {
  return props.book.expand?.assets_via_book?.find(
    (asset) => asset.type === "0000000000cover",
  );
});

const ui = {
  base: "relative overflow-hidden",
  shadow: "shadow",
  body: {
    padding: "p-0 sm:p-0",
  },
};
</script>

<template>
  <div
    class="group h-auto w-full"
    :class="{
      'flex w-full gap-3': wide,
      'select-none': !draggable,
    }"
    :draggable
  >
    <UCard :ui :class="{ 'w-32 flex-shrink-0': wide }">
      <template v-if="!wide">
        <UBadge
          v-if="book.edition"
          class="absolute right-2 top-2 z-20 text-gray-900"
          color="amber"
        >
          {{ book.edition }}
        </UBadge>
      </template>

      <div class="absolute bottom-2 right-2 z-20 flex items-center gap-1">
        <slot name="button" />
      </div>

      <AppImageCover
        class="relative z-10 transition-all group-hover:brightness-90 dark:group-hover:brightness-75"
        :name="publication.name"
        :src="image && $pb.files.getUrl(image, image.image)"
        :srcset="image && image.resizedImage"
        :sizes
        :draggable
      />

      <USkeleton class="absolute inset-0" />
    </UCard>

    <div>
      <template v-if="wide">
        <UBadge v-if="book.edition" class="text-gray-900" color="amber">
          {{ book.edition }}
        </UBadge>
      </template>

      <div v-if="publication" class="mt-2">
        <div
          class="decoration-primary-400 font-condensed text-xl font-black decoration-[.2rem] underline-offset-[.2rem] group-hover:underline"
        >
          {{ publication.name }}
          <div class="text-gray-500 dark:text-gray-400">
            <span v-if="publication.subtitle">
              ({{ publication.subtitle }})
            </span>
          </div>
        </div>
      </div>

      <div v-if="book.price" class="mt-1">
        <span class="block text-gray-500 dark:text-gray-400">
          {{ book.price }}
        </span>
      </div>
    </div>
  </div>
</template>
