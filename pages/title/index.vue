<script setup lang="ts">
import {
  type AssetsResponse,
  Collections,
  type FormatsResponse,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";
import {
  AppImageCover,
  SlideoverTitleCreate,
  UBadge,
  ULink,
} from "#components";
import type { TableColumn, TableRow } from "@nuxt/ui";
import { joinURL } from "ufo";
import type { MetadataImages } from "~/types/common";

const { $pb } = useNuxtApp();
const { query } = useRoute();
const { replace } = useRouter();
const overlay = useOverlay();

const titleCreate = overlay.create(SlideoverTitleCreate);

const page = ref(1);
const sort = ref("-updated");
const searchQuery = ref(query.q ? (query.q as string) : "");

type RowData = TitlesResponse<
  unknown,
  {
    format: FormatsResponse;
    defaultRelease: ReleasesResponse<{
      front: AssetsResponse<MetadataImages>;
    }>;
  }
>;

const { data, status, refresh } = await useAsyncData(
  () =>
    $pb.collection(Collections.Titles).getList<RowData>(page.value, 20, {
      filter: $pb.filter(
        "additionalTitleNames_via_title.name ?~ {:name} || name ~ {:name}",
        { name: searchQuery.value },
      ),
      expand: "format, defaultRelease, defaultRelease.front",
      sort: sort.value,
    }),
  {
    watch: [page, sort],
  },
);

watch(searchQuery, () => {
  replace({ query: { q: searchQuery.value } });
});

const columns: TableColumn<RowData>[] = [
  {
    accessorKey: "cover",
    header: "",
    cell: ({ row }) => {
      return h(AppImageCover, {
        class: "rounded",
        name: row.original.name,
        src:
          row.original?.expand?.defaultRelease?.expand?.front &&
          $pb.files.getUrl(
            row.original.expand.defaultRelease.expand.front,
            row.original.expand.defaultRelease.expand.front.image,
          ),
        srcset:
          row.original?.expand?.defaultRelease?.expand?.front &&
          row.original.expand.defaultRelease.expand.front.resizedImage,
      });
    },
    meta: {
      class: {
        td: "max-w-8",
      },
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return h("div", [
        h(UBadge, () => row.original.expand?.format.name),
        h(
          ULink,
          { class: "mt-1.5 block", href: joinURL("/title", row.original.id) },
          row.original.name,
        ),
      ]);
    },
  },
  {
    accessorKey: "actions",
    header: "",
  },
];

async function create() {
  if (await titleCreate.open()) {
    refresh();
  }
}

async function onSelect(row: TableRow<RowData>, _?: Event) {
  await navigateTo(joinURL("/title", row.original.id));
}

useHead({
  title: "Title listing",
});
</script>

<template>
  <div
    class="max-h-screen flex-col flex divide-y divide-(--ui-border-accented)"
  >
    <form class="p-3 flex gap-3" @submit.prevent="() => refresh()">
      <UInput
        v-model="searchQuery"
        icon="i-fluent-search-20-filled"
        placeholder="Search..."
        color="neutral"
      />
      <UButton
        type="submit"
        :loading="status === 'pending'"
        color="neutral"
        variant="outline"
      >
        Search
      </UButton>

      <div class="flex items-center justify-end gap-3 ml-auto">
        <TitleSort v-model="sort" />
        <UButton
          variant="outline"
          color="neutral"
          icon="i-fluent-arrow-clockwise-20-filled"
          :loading="status === 'pending'"
          @click="refresh()"
        >
          Refresh
        </UButton>
        <UButton icon="i-fluent-add-square-multiple-20-filled" @click="create">
          Create
        </UButton>
      </div>
    </form>

    <UTable
      :columns
      :data="data?.items"
      :loading="status === 'pending'"
      sticky
      class="h-full flex-1"
      @select="onSelect"
    />

    <div v-if="data" class="flex justify-between items-center p-3">
      <div>{{ data.totalItems }} titles</div>

      <UPagination
        v-model:page="page"
        class="justify-center"
        :items-per-page="20"
        :total="data.totalItems"
        :ui="{ list: 'justify-center' }"
      />
    </div>
  </div>
</template>
