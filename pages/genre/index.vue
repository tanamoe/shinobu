<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();

const page = ref(1);
const query = ref("");

const { data, status, execute } = await useAsyncData(
  () =>
    $pb.collection(Collections.Genres).getList(page.value, 15, {
      filter: $pb.filter("name ~ {:name}", { name: query.value }),
    }),
  {
    watch: [page],
  },
);
</script>

<template>
  <div v-if="data" class="p-6 max-h-screen flex-col flex space-y-6">
    <AppBreadcrumb :items="[{ label: 'Genre', active: true }]" />

    <form class="flex gap-3" @submit.prevent="execute()">
      <div class="flex-1">
        <UInput
          v-model="query"
          icon="i-fluent-search-20-filled"
          placeholder="Search..."
          color="neutral"
        />
      </div>
      <UButton type="submit" :loading="status === 'pending'" color="neutral">
        Search
      </UButton>
    </form>

    <UTable :rows="data.items || []" :loading="status === 'pending'" />

    <div class="flex items-center justify-center">
      <UPagination
        v-model="page"
        :page-count="15"
        :total="data.totalItems || 0"
      />
    </div>

    <PageGenreCreate />
    <PageGenreEdit />
  </div>
</template>
