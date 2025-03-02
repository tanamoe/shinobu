<script setup lang="ts">
import {
  type AssetsResponse,
  Collections,
  type FormatsResponse,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";
import { SlideoverTitleCreate, UBadge, ULink } from "#components";
import type { TableColumn } from "@nuxt/ui";
import { joinURL } from "ufo";

const { $pb } = useNuxtApp();
const { query } = useRoute();
const { replace } = useRouter();
const overlay = useOverlay();

const page = ref(1);
const sort = ref("-updated");
const searchQuery = ref(query.q ? (query.q as string) : "");

type TableRow = TitlesResponse<
  unknown,
  {
    format: FormatsResponse;
    defaultRelease: ReleasesResponse<{
      front: AssetsResponse;
    }>;
  }
>;

const { data, status, refresh } = await useAsyncData(
  () =>
    $pb.collection(Collections.Titles).getList<TableRow>(page.value, 20, {
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

const columns: TableColumn<TableRow>[] = [
  {
    accessorKey: "cover",
    header: "",
    cell: ({ row }) => {
      if (row.original?.expand?.defaultRelease?.expand?.front.image) {
        return h("img", {
          class: "h-14 aspect-[2/3] object-cover rounded",
          src: $pb.files.getUrl(
            row.original.expand.defaultRelease.expand.front,
            row.original.expand.defaultRelease.expand.front.image,
          ),
        });
      }
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

function create() {
  overlay
    .create(SlideoverTitleCreate, {
      props: { onChange: () => refresh() },
    })
    .open();
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
