<script setup lang="ts">
import {
  SlideoverBooks,
  SlideoverPublicationEdit,
  ModalPublicationQuickCreate,
  SlideoverPublicationCreate,
  ModalPublicationRemove,
} from "#components";
import {
  Collections,
  type TitlesResponse,
  type PublicationsResponse,
  type ReleasesResponse,
  type AssetsResponse,
  type BooksResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const slideover = useSlideover();
const modal = useModal();

const props = defineProps<{
  release: ReleasesResponse<{
    title: TitlesResponse;
  }>;
}>();

const { data: publications, refresh } = await useAsyncData(() =>
  $pb.collection(Collections.Publications).getFullList<
    PublicationsResponse<
      unknown,
      {
        defaultBook?: BooksResponse<
          unknown,
          {
            assets_via_book?: AssetsResponse[];
          }
        >;
      }
    >
  >({
    filter: $pb.filter("release.id = {:release}", {
      release: props.release.id,
    }),
    sort: "-volume",
    expand: "defaultBook.assets_via_book",
  }),
);

const columns = [
  {
    key: "volume",
    label: "Volume",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "assets",
    label: "Assets",
  },
  {
    key: "actions",
  },
];

function create(release: ReleasesResponse) {
  slideover.open(SlideoverPublicationCreate, {
    release,
  });
}

function quickCreate(release: ReleasesResponse<{ title: TitlesResponse }>) {
  modal.open(ModalPublicationQuickCreate, {
    release,
  });
}

function books(publication: PublicationsResponse) {
  slideover.open(SlideoverBooks, {
    publication,
  });
}

function edit(publication: PublicationsResponse) {
  slideover.open(SlideoverPublicationEdit, {
    publication,
    onChange: () => refresh(),
  });
}

function remove(publication: PublicationsResponse) {
  modal.open(ModalPublicationRemove, {
    publication,
    onChange: () => refresh(),
  });
}
</script>

<template>
  <div>
    <div class="flex items-center justify-end gap-3 mt-12">
      <UButton
        color="gray"
        icon="i-fluent-collections-add-20-filled"
        class="float-right"
        @click="quickCreate(release)"
      >
        Quick create
      </UButton>

      <UButton
        color="gray"
        icon="i-fluent-add-square-multiple-20-filled"
        class="float-right"
        @click="create(release)"
      >
        Create
      </UButton>
    </div>

    <UTable :columns="columns" :rows="publications || []">
      <template #volume-data="{ row }">
        <UBadge color="gray">
          {{ Math.floor(row.volume / 10000) + (row.volume % 10) * 0.1 }}
        </UBadge>
      </template>

      <template #name-data="{ row }">
        <span>{{ row.name }}</span>
      </template>

      <template #assets-data="{ row }">
        <div
          v-if="row.expand?.defaultBook?.expand?.assets_via_book"
          class="flex gap-3"
        >
          <NuxtLink
            v-for="asset in row.expand.defaultBook.expand.assets_via_book"
            :key="asset.id"
            :to="$pb.files.getUrl(asset, asset.image)"
            target="_blank"
          >
            <img
              class="w-12 h-auto rounded-md"
              :src="$pb.files.getUrl(asset, asset.image, { thumb: '100x100' })"
            />
          </NuxtLink>
        </div>
      </template>

      <template #actions-data="{ row }">
        <div class="space-x-3">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-list-20-filled"
            @click="books(row)"
          />
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-edit-20-filled"
            square
            @click="edit(row)"
          />
          <UButton
            color="red"
            variant="ghost"
            icon="i-fluent-delete-20-filled"
            @click="remove(row)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
