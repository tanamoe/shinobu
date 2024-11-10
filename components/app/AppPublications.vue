<script setup lang="ts">
import {
  SlideoverBook,
  SlideoverPublicationEdit,
  ModalPublicationQuickCreate,
  SlideoverPublicationCreate,
  ModalPublicationRemove,
} from "#components";
import type {
  PublicationsResponse,
  ReleasesResponse,
  BooksResponse,
  AssetsResponse,
  AssetTypesResponse,
  BookMetadataResponse,
} from "@/types/pb";
import type { MetadataImages } from "~/types/common";

const slideover = useSlideover();
const modal = useModal();

const props = defineProps<{
  release: ReleasesResponse;
  publications: PublicationsResponse<
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
}>();

const columns = [
  {
    key: "volume",
    label: "Volume",
    sortable: true,
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "actions",
  },
];

const emit = defineEmits<{
  change: [];
}>();

function create(release: ReleasesResponse) {
  slideover.open(SlideoverPublicationCreate, {
    release,
    onChange: () => emit("change"),
  });
}

function quickCreate(release: ReleasesResponse) {
  modal.open(ModalPublicationQuickCreate, {
    release,
    onChange: () => emit("change"),
  });
}

function editBook(
  publication: PublicationsResponse,
  book: BooksResponse<
    unknown,
    {
      assets_via_book?: AssetsResponse<
        MetadataImages,
        { type: AssetTypesResponse }
      >[];
      bookMetadata_via_book?: BookMetadataResponse;
    }
  >,
) {
  slideover.open(SlideoverBook, {
    publication,
    book,
    assets: book.expand?.assets_via_book,
    metadata: book.expand?.bookMetadata_via_book,
    onChange: () => emit("change"),
  });
}

function edit(publication: PublicationsResponse) {
  slideover.open(SlideoverPublicationEdit, {
    publication,
    onChange: () => emit("change"),
  });
}

function remove(publication: PublicationsResponse) {
  modal.open(ModalPublicationRemove, {
    publication,
    onChange: () => emit("change"),
  });
}

const expand = ref({
  openedRows: [],
  row: null,
});
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

    <UTable
      v-model:expand="expand"
      :columns="columns"
      :rows="publications || []"
    >
      <template #volume-data="{ row }">
        <AppVolume :volume="row.volume" />
      </template>

      <template #name-data="{ row }">
        <span>
          {{ row.name }}
          <span v-if="row.subtitle">({{ row.subtitle }})</span>
        </span>
      </template>

      <template #expand="{ row }">
        <div class="grid grid-cols-4 py-6 gap-6">
          <AppBook
            v-for="book in row.expand?.books_via_publication"
            :key="book.id"
            :book
            :publication="row"
            wide
          >
            <template #button>
              <UButton
                color="gray"
                icon="i-fluent-edit-20-filled"
                square
                @click="editBook(row, book)"
              />
            </template>
          </AppBook>
        </div>
      </template>

      <template #actions-data="{ row }">
        <div class="space-x-3">
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
