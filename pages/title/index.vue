<script setup lang="ts">
import {
  type BaseSystemFields,
  Collections,
  type FormatsResponse,
  type TitlesResponse,
} from "@/types/pb";
import SlideoverTitleCreate from "#components";

const { $pb } = useNuxtApp();
const slideover = useSlideover();

const page = ref(1);
const searchQuery = ref("");

const {
  data: rows,
  status,
  refresh,
} = await useAsyncData(
  () =>
    $pb.collection(Collections.Titles).getList<
      TitlesResponse<{
        format: FormatsResponse;
      }>
    >(page.value, 20, {
      filter: `name~'${searchQuery.value}'`,
      expand: "format",
      sort: "-updated",
    }),
  {
    watch: [page],
  },
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

function create() {
  slideover.open(SlideoverTitleCreate, {
    onChange: () => refresh(),
  });
}

useHead({
  title: "Title listing",
});
</script>

<template>
  <div class="p-6 max-h-screen flex-col flex space-y-6">
    <UBreadcrumb
      class="mb-6"
      :links="[
        { label: 'Title', to: '/title', icon: 'i-fluent-book-20-filled' },
      ]"
    />

    <form class="flex gap-3" @submit.prevent="() => refresh()">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-fluent-search-20-filled"
          placeholder="Search..."
          color="white"
        />
      </div>
      <UButton type="submit" :loading="status === 'pending'" color="gray">
        Search
      </UButton>
    </form>

    <div class="flex items-center justify-end gap-3">
      <UButton
        variant="ghost"
        color="gray"
        icon="i-fluent-arrow-clockwise-20-filled"
        :loading="status === 'pending'"
        @click="refresh()"
      >
        Refresh
      </UButton>
      <UButton
        color="gray"
        icon="i-fluent-add-square-multiple-20-filled"
        class="float-right"
        @click="create"
      >
        Create
      </UButton>
    </div>

    <div class="flex-1 overflow-y-scroll">
      <UTable
        :columns="columns"
        :rows="rows?.items || []"
        :loading="status === 'pending'"
        @select="
          async (row: BaseSystemFields) => await navigateTo(`/title/${row.id}`)
        "
      >
        <template #cover-data="{ row }">
          <div v-if="row.cover" class="space-x-3">
            <img
              class="h-14 aspect-[2/3] object-cover rounded"
              :src="$pb.files.getUrl(row, row.cover)"
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
      v-model="page"
      class="justify-center"
      :page-count="20"
      :total="rows?.totalItems || 0"
    />
  </div>
</template>
