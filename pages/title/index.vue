<script setup lang="ts">
import {
  type BaseSystemFields,
  Collections,
  type FormatResponse,
  type TitleResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();

const page = ref(1);
const searchQuery = ref("");

const createOpen = ref(false);
const quickCreateOpen = ref(false);

const metadata = await $pb
  .collection(Collections.Title)
  .getList<TitleResponse>(1, 1);

const {
  pending,
  data: rows,
  refresh,
} = await useAsyncData(
  () =>
    $pb.collection(Collections.Title).getList<
      TitleResponse<{
        format: FormatResponse;
      }>
    >(page.value, 20, {
      filter: `name~'${searchQuery.value}'`,
      expand: "format",
      sort: "-updated",
    }),
  { watch: [page] },
);

const columns = [
  {
    key: "cover",
    label: "Cover",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "actions",
  },
];

useHead({
  title: "Title listing",
});
</script>

<template>
  <div class="p-6 max-h-screen flex-col flex space-y-6">
    <AppBreadcrumb :items="[{ label: 'Title', active: true }]" />

    <form class="flex gap-3" @submit.prevent="() => refresh()">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-fluent-search-20-filled"
          placeholder="Search..."
          color="white"
        />
      </div>
      <UButton type="submit" :loading="pending" color="gray">Search</UButton>
    </form>

    <div class="flex items-center justify-end gap-3">
      <UButton
        variant="ghost"
        color="gray"
        icon="i-fluent-arrow-clockwise-20-filled"
        :loading="pending"
        @click="refresh()"
      >
        Refresh
      </UButton>
      <UButton
        color="gray"
        icon="i-fluent-collections-add-20-filled"
        class="float-right"
        disabled
        @click="createOpen = true"
      >
        Quick create
      </UButton>
      <UButton
        color="gray"
        icon="i-fluent-add-square-multiple-20-filled"
        class="float-right"
        @click="createOpen = true"
      >
        Create
      </UButton>
    </div>

    <div class="flex-1 overflow-y-scroll">
      <UTable
        :columns="columns"
        :rows="rows?.items || []"
        :loading="pending"
        @select="(row: BaseSystemFields) => navigateTo(`/title/${row.id}`)"
      >
        <template #cover-data="{ row }">
          <div v-if="row.cover" class="space-x-3">
            <img
              class="h-14 aspect-[2/3] object-cover rounded"
              :src="usePocketbaseImage(row, row.cover)"
            />
          </div>
        </template>
        <template #name-data="{ row }">
          <div class="space-y-1.5">
            <UBadge color="gray">{{ row.expand.format.name }}</UBadge>
            <div>{{ row.name }}</div>
          </div>
        </template>
        <template #actions-data>
          <div class="flex justify-end">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-fluent-arrow-right-20-filled"
            />
          </div>
        </template>
      </UTable>
    </div>

    <UPagination
      v-if="metadata"
      v-model="page"
      class="justify-center"
      :page-count="20"
      :total="metadata.totalItems"
    />

    <TitleCreateSlideover v-model="createOpen" />
  </div>
</template>
