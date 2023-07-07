<script setup lang="ts">
const { $pb } = useNuxtApp();

const metadata = await $pb.collection("title").getList(1, 1);

const totalItems = metadata.totalItems;

const page = ref(1);

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    class: "whitespace-normal",
    label: "Name",
  },
  {
    key: "actions",
  },
];

const { pending, data: rows } = await useAsyncData(
  "title",
  () => $pb.collection("title").getList(page.value, 20),
  { watch: [page], server: false },
);
</script>

<template>
  <div class="p-6 max-h-screen flex-col flex space-y-6">
    <AppHeader>Danh sách truyện</AppHeader>
    <div class="flex-1 overflow-y-scroll">
      <UTable :columns="columns" :rows="rows?.items || []" :loading="pending">
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
      v-model="page"
      class="justify-center"
      :page-count="20"
      :total="totalItems"
    />
  </div>
</template>
