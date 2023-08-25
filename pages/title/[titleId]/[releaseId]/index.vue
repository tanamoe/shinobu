<script setup lang="ts">
import {
  Collections,
  ReleaseStatusOptions,
  type TitleResponse,
  type PublicationResponse,
  type ReleaseResponse,
  PublisherResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const route = useRoute();
const { pending, update } = useUpdateRelease();

const { data: title } = await useAsyncData(
  () =>
    $pb
      .collection(Collections.Title)
      .getOne<TitleResponse>(route.params.titleId as string),
  { transform: (title) => structuredClone(title) },
);

const { data: release } = await useAsyncData(
  () =>
    $pb
      .collection(Collections.Release)
      .getOne<ReleaseResponse>(route.params.releaseId as string),
  { transform: (release) => structuredClone(release) },
);

if (!release.value || !title.value) throw createError({ statusCode: 404 });

const { pending: publishersPending, data: publishers } = await useAsyncData(
  () => $pb.collection(Collections.Publisher).getFullList<PublisherResponse>(),
  {
    transform: (publishers) =>
      structuredClone(publishers).map((publisher) => ({
        value: publisher.id,
        label: publisher.name,
      })),
  },
);

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
  pending: publicationsPending,
  data: publications,
  refresh,
} = await useLazyAsyncData(
  "publications",
  () =>
    $pb.collection(Collections.Publication).getFullList<PublicationResponse>({
      filter: `release.id = '${release.value!.id}'`,
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

function handleUpdate(e: Event) {
  update(release.value!.id, new FormData(e.target as HTMLFormElement));
}

watch([booksOpen, publicationOpen, createOpen, deleteOpen], () => refresh());
</script>

<template>
  <div v-if="release && title" class="p-6">
    <AppH1>
      <NuxtLink class="text-zinc-400" to="/title"> Title / </NuxtLink>
      <NuxtLink class="text-zinc-400" :to="`/title/${title.id}`">
        {{ title.name }} /
      </NuxtLink>
      {{ release.name }}
    </AppH1>

    <form class="space-y-3" @submit.prevent="handleUpdate">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <UFormGroup name="name" label="Name">
          <UInput v-model="release.name" />
        </UFormGroup>

        <UFormGroup name="status" label="Status">
          <USelect
            v-model="release.status"
            :options="Object.values(ReleaseStatusOptions)"
          />
        </UFormGroup>

        <UFormGroup name="publisher" label="Publisher">
          <USelect
            v-model="release.publisher"
            :options="publishers || []"
            :loading="publishersPending"
          />
        </UFormGroup>
      </div>

      <div class="text-right">
        <UButton
          color="gray"
          icon="i-fluent-save-20-filled"
          :loading="pending"
          type="submit"
        >
          Save
        </UButton>
      </div>
    </form>

    <div class="flex justify-end mt-12">
      <UButton
        class="ml-auto"
        icon="i-fluent-add-20-filled"
        color="gray"
        @click="toggleCreate"
      >
        Create
      </UButton>
    </div>

    <UTable
      :columns="columns"
      :rows="publications || []"
      :loading="publicationsPending"
    >
      <template #digital-data="{ row }">
        <UCheckbox v-model="row.digital" disabled />
      </template>
      <template #cover-data="{ row }">
        <div v-if="row.cover">
          <img
            v-for="image in row.cover"
            :key="image"
            class="w-12 h-auto rounded-md"
            :src="$pb.getFileUrl(row, image, { thumb: '100x100' })"
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
