<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();

const page = ref(1);
const query = ref("");

const { data, pending, execute } = await useAsyncData(
  () =>
    $pb.collection(Collections.Staffs).getList(page.value, 15, {
      filter: $pb.filter("name ~ {:name}", { name: query.value }),
    }),
  {
    watch: [page],
  },
);

const columns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "action",
  },
];
</script>

<template>
  <div v-if="data" class="p-6 max-h-screen flex-col flex space-y-6">
    <AppBreadcrumb :items="[{ label: 'Staff', active: true }]" />

    <form class="flex gap-3" @submit.prevent="execute()">
      <div class="flex-1">
        <UInput
          v-model="query"
          icon="i-fluent-search-20-filled"
          placeholder="Search..."
          color="white"
        />
      </div>
      <UButton type="submit" :loading="pending" color="gray">Search</UButton>
    </form>

    <UTable :rows="data.items || []" :columns="columns" :loading="pending">
      <template #action-data>
        <UButton
          icon="i-fluent-pen-20-filled"
          variant="ghost"
          color="gray"
          square
        />
      </template>
    </UTable>

    <div class="flex items-center justify-center">
      <UPagination
        v-model="page"
        :page-count="15"
        :total="data.totalItems || 0"
      />
    </div>
  </div>
</template>
