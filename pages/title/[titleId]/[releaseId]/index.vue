<script setup lang="ts">
import { Record } from "pocketbase";

const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();
const route = useRoute();

const title = await $pb
  .collection("title")
  .getOne(route.params.titleId as string);

const release = await $pb
  .collection("release")
  .getOne(route.params.releaseId as string);

const columns = [
  {
    key: "volume",
    label: "Volume",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "digital",
    label: "Digital",
  },
  {
    key: "cover",
    label: "Cover",
  },
  {
    key: "actions",
  },
];

const { pending, data: publications } = useLazyAsyncData(
  "publications",
  async () =>
    await $pb.collection("publication").getFullList({
      filter: `release.id = '${release.id}'`,
      sort: "volume",
    }),
  {
    transform: (publications) =>
      publications.map((publication) => ({
        ...publication,
        volume: publication.volume / 10000 + (publication.volume % 10) * 0.1,
      })),
  },
);

const publicationOpen = ref(false);
const booksOpen = ref(false);
const currentPublication = ref<Partial<Record>>();

const toggleEdit = (publication: Record) => {
  publicationOpen.value = true;
  // create new object for updating
  currentPublication.value = { ...publication };
};

const toggleEditBook = async (publication: Record) => {
  booksOpen.value = true;
  // reference current publication as clone is not needed
  currentPublication.value = publication;
};
</script>

<template>
  <div class="p-6">
    <AppH1>
      <NuxtLink class="text-zinc-400" to="/title">
        Danh sách truyện /
      </NuxtLink>
      <NuxtLink class="text-zinc-400" :to="`/title/${title.id}`">
        {{ title.name }} /
      </NuxtLink>
      {{ release.name }}
    </AppH1>

    <UTable :columns="columns" :rows="publications || []" :loading="pending">
      <template #digital-data="{ row }">
        <UCheckbox v-model="row.digital" disabled />
      </template>
      <template #cover-data="{ row }">
        <div v-if="row.cover" class="space-x-3">
          <img
            v-for="image in row.cover"
            :key="image"
            class="h-8 rounded"
            :src="`${runtimeConfig.public.pocketbaseUrl}/api/files/${row.collectionId}/${row.id}/${image}?thumb=100x100`"
          />
        </div>
      </template>
      <template #actions-data="{ row }">
        <div class="space-x-3">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-list-20-filled"
            @click="toggleEditBook(row)"
          />
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-edit-20-filled"
            @click="toggleEdit(row)"
          />
        </div>
      </template>
    </UTable>

    <PublicationUpdateSlideover
      v-if="currentPublication"
      v-model="publicationOpen"
      :publication="currentPublication"
    />

    <PublicationUpdateBooksSlideover
      v-if="currentPublication"
      v-model="booksOpen"
      :publication="currentPublication"
    />
  </div>
</template>
