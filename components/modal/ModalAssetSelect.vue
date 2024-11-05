<script setup lang="ts">
import {
  type AssetsResponse,
  Collections,
  type RecordIdString,
} from "@/types/pb";
import type { MetadataImages } from "@/types/common";

interface Props {
  release?: RecordIdString;
  sort?: string;
}

const modal = useModal();
const { $pb } = useNuxtApp();

const props = withDefaults(defineProps<Props>(), {
  release: "%",
  sort: "-updated",
});

const emit = defineEmits<{
  select: [AssetsResponse<MetadataImages>];
}>();

const page = ref(1);
const perPage = ref(24);

const { data: assets } = await useAsyncData(() =>
  $pb
    .collection(Collections.Assets)
    .getList<AssetsResponse<MetadataImages>>(page.value, perPage.value, {
      filter: $pb.filter("book.publication.release ~ {:release}", {
        release: props.release,
      }),
      sort: props.sort,
    }),
);

function select(asset: AssetsResponse<MetadataImages>) {
  emit("select", asset);
  modal.close();
}

const ui = {
  width: "w-full sm:max-w-screen-lg",
};
</script>

<template>
  <UModal :ui>
    <UCard>
      <template #header>Assets</template>

      <div v-if="assets" class="grid grid-cols-6 gap-3">
        <AppImage
          v-for="asset in assets.items"
          :key="asset.id"
          class="rounded w-full object-contain aspect-[1/1] bg-gray-200 dark:bg-gray-800 hover:brightness-75 transition-all hover:cursor-pointer"
          :src="$pb.files.getUrl(asset, asset.image)"
          :srcset="asset.resizedImage"
          @click="() => select(asset)"
        />
      </div>
    </UCard>
  </UModal>
</template>
