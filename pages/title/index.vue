<script setup lang="ts">
import { Collections, type TitleResponse } from "@/types/pb";

const { $pb } = useNuxtApp();

const page = ref(1);
const searchQuery = ref("");

const metadata = await $pb
  .collection(Collections.Title)
  .getList<TitleResponse>(1, 1);

const {
  pending,
  data: rows,
  refresh,
} = await useAsyncData(
  "title",
  () =>
    $pb.collection(Collections.Title).getList<TitleResponse>(page.value, 20, {
      filter: `name~'${searchQuery.value}'`,
    }),
  { watch: [page], transform: (data) => structuredClone(data) },
);

const columns = [
  {
    key: "name",
    class: "whitespace-normal",
    label: "Name",
  },
  {
    key: "actions",
  },
];
</script>

<template>
  <div class="p-6 max-h-screen flex-col flex space-y-6">
    <AppH1>Danh sách truyện</AppH1>
    <form class="flex gap-3" @submit.prevent="() => refresh()">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search..."
          color="white"
        />
      </div>
      <UButton type="submit" :loading="pending">Search</UButton>
    </form>

    <div class="flex-1 overflow-y-scroll">
      <UTable :columns="columns" :rows="rows?.items || []" :loading="pending">
        <template #cover-data="{ row }">
          <div v-if="row.cover" class="space-x-3">
            <img
              v-for="image in row.cover"
              :key="image"
              class="h-8 rounded"
              :src="usePocketbaseImage(row, image, '?thumb=100x100')"
            />
          </div>
        </template>
        <template #actions-data="{ row }">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-arrow-right-20-filled"
            :to="`/title/${row.id}`"
          />
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
  </div>
</template>
