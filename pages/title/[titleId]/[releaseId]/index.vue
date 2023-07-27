<script setup lang="ts">
import {
  Collections,
  type TitleResponse,
  type PublicationResponse,
  type ReleaseResponse,
} from "@/types/pb";

const runtimeConfig = useRuntimeConfig();
const { $pb } = useNuxtApp();
const route = useRoute();

const title = await $pb
  .collection(Collections.Title)
  .getOne<TitleResponse>(route.params.titleId as string);

const release = await $pb
  .collection(Collections.Release)
  .getOne<ReleaseResponse>(route.params.releaseId as string);

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

const {
  pending,
  data: publications,
  refresh,
} = await useLazyAsyncData(
  "publications",
  () =>
    $pb.collection(Collections.Publication).getFullList<PublicationResponse>({
      filter: `release.id = '${release.id}'`,
      sort: "volume",
    }),
  { transform: (data) => structuredClone(data) },
);

const publicationOpen = ref(false);
const booksOpen = ref(false);
const createOpen = ref(false);
const deleteOpen = ref(false);
const currentPublication = ref<PublicationResponse>();

const toggleCreate = () => (createOpen.value = true);

const toggleEdit = (publication: PublicationResponse) => {
  publicationOpen.value = true;
  // create new object for updating
  currentPublication.value = { ...publication };
};

const toggleEditBook = (publication: PublicationResponse) => {
  booksOpen.value = true;
  // reference current publication as clone is not needed
  currentPublication.value = publication;
};

const toggleDelete = (publication: PublicationResponse) => {
  deleteOpen.value = true;
  currentPublication.value = publication;
};

watch([booksOpen, publicationOpen, createOpen, deleteOpen], () => refresh());
</script>

<template>
  <div class="p-6">
    <AppH1>
      <NuxtLink class="text-zinc-400" to="/title"> Title / </NuxtLink>
      <NuxtLink class="text-zinc-400" :to="`/title/${title.id}`">
        {{ title.name }} /
      </NuxtLink>
      {{ release.name }}
    </AppH1>

    <div class="flex justify-end">
      <UButton
        class="ml-auto"
        icon="i-fluent-add-20-filled"
        @click="toggleCreate"
      >
        Create
      </UButton>
    </div>

    <UTable :columns="columns" :rows="publications || []" :loading="pending">
      <template #digital-data="{ row }">
        <UCheckbox v-model="row.digital" disabled />
      </template>
      <template #cover-data="{ row }">
        <div v-if="row.cover">
          <UAvatarGroup size="sm" :max="5">
            <UAvatar
              v-for="image in row.cover"
              :key="image"
              :src="`${runtimeConfig.public.pocketbaseUrl}/api/files/${row.collectionId}/${row.id}/${image}?thumb=100x100`"
            />
          </UAvatarGroup>
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
          <UButton
            color="red"
            variant="ghost"
            icon="i-fluent-delete-20-filled"
            @click="toggleDelete(row)"
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

    <PublicationCreateSlideover v-model="createOpen" :release="release" />

    <PublicationDeleteModal
      v-if="currentPublication"
      v-model="deleteOpen"
      :publication="currentPublication"
    />
  </div>
</template>
