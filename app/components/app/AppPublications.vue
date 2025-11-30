<script setup lang="ts">
import {
  SlideoverBook,
  ModalPublicationQuickCreate,
  SlideoverPublicationCreate,
  ModalPublicationRemove,
  UButton,
} from "#components";
import type {
  PublicationsResponse,
  ReleasesResponse,
  BooksResponse,
  AssetsResponse,
  AssetTypesResponse,
  BookMetadataResponse,
} from "@/types/pb";
import type { TableColumn } from "@nuxt/ui";
import type { MetadataImages } from "@/types/common";
import AppVolume from "../AppVolume.vue";

const overlay = useOverlay();

type Publication = PublicationsResponse<
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
>;

defineProps<{
  release: ReleasesResponse;
  publications: Publication[];
}>();

const columns: TableColumn<Publication>[] = [
  {
    id: "expand",
    header: "",
  },
  {
    accessorKey: "volume",
    header: "Volume",
    cell: ({ row }) => {
      return h(AppVolume, { volume: row.original.volume });
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    header: "",
  },
];

const emit = defineEmits<{
  change: [];
}>();

function create(release: ReleasesResponse) {
  overlay
    .create(SlideoverPublicationCreate, {
      props: {
        release,
        onChange: () => emit("change"),
      },
    })
    .open();
}

function quickCreate(release: ReleasesResponse) {
  overlay
    .create(ModalPublicationQuickCreate, {
      props: {
        release,
        onChange: () => emit("change"),
      },
    })
    .open();
}

function addBook(publication: PublicationsResponse) {
  overlay
    .create(SlideoverBook, {
      props: {
        publication,
        onChange: () => emit("change"),
      },
    })
    .open();
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
  overlay
    .create(SlideoverBook, {
      props: {
        publication,
        book,
        assets: book.expand?.assets_via_book,
        metadata: book.expand?.bookMetadata_via_book,
        onChange: () => emit("change"),
      },
    })
    .open();
}

function remove(publication: PublicationsResponse) {
  overlay
    .create(ModalPublicationRemove, {
      props: {
        publication,
        onChange: () => emit("change"),
      },
    })
    .open();
}
</script>

<template>
  <div class="divide-y divide-(--ui-border-accented)">
    <div class="flex items-center justify-end gap-3 p-3">
      <UButton
        color="neutral"
        icon="i-fluent-collections-add-20-filled"
        class="float-right"
        @click="quickCreate(release)"
      >
        Quick create
      </UButton>

      <UButton
        color="neutral"
        icon="i-fluent-add-square-multiple-20-filled"
        class="float-right"
        @click="create(release)"
      >
        Create
      </UButton>
    </div>

    <UTable :columns :data="publications">
      <template #expanded="{ row }">
        <FormPublicationDescription :publication="row.original" class="mb-6" />
        <div class="grid grid-cols-4 gap-6">
          <AppBook
            v-for="book in row.original.expand?.books_via_publication"
            :key="book.id"
            :book
            :publication="row.original"
            wide
          >
            <template #button>
              <UButton
                color="neutral"
                icon="i-fluent-edit-20-filled"
                square
                @click="editBook(row.original, book)"
              />
            </template>
          </AppBook>
        </div>
      </template>

      <template #expand-cell="{ row }">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-fluent-chevron-down-20-filled"
          square
          @click="() => row.toggleExpanded()"
        />
      </template>

      <template #name-cell="{ row }">
        <FormPublicationName :publication="row.original" />
      </template>

      <template #actions-cell="{ row }">
        <div class="space-y-3">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-fluent-add-20-filled"
            @click="addBook(row.original)"
          />
          <UButton
            color="error"
            variant="ghost"
            icon="i-fluent-delete-20-filled"
            @click="remove(row.original)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>
