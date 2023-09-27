<script setup lang="ts">
import {
  Collections,
  type PublicationResponse,
  type ReleaseResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();

const props = defineProps<{
  release: ReleaseResponse;
}>();

const publication = ref<PublicationResponse>();

const createOpen = ref(false);
const editOpen = ref(false);
const booksOpen = ref(false);
const removeOpen = ref(false);

const {
  pending,
  data: publications,
  refresh,
} = await useLazyAsyncData("publications", () =>
  $pb.collection(Collections.Publication).getFullList<PublicationResponse>({
    filter: `release.id = '${props.release.id}'`,
    sort: "volume",
  }),
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

function handleEdit(row: PublicationResponse) {
  editOpen.value = true;
  publication.value = { ...row };
}

function handleEditBook(row: PublicationResponse) {
  booksOpen.value = true;
  publication.value = { ...row };
}

function handleRemove(row: PublicationResponse) {
  removeOpen.value = true;
  publication.value = { ...row };
}

defineShortcuts({
  n: {
    usingInput: true,
    handler: () => {
      createOpen.value = true;
    },
  },
});
</script>

<template>
  <div class="flex justify-end mt-12">
    <UButton class="ml-auto" color="gray" @click="createOpen = true">
      Create
      <UKbd>N</UKbd>
    </UButton>
  </div>

  <UTable :columns="columns" :rows="publications || []" :loading="pending">
    <template #volume-data="{ row }">
      <UBadge color="gray">
        {{ Math.floor(row.volume / 10000) + (row.volume % 10) * 0.1 }}
      </UBadge>
    </template>
    <template #digital-data="{ row }">
      <UCheckbox v-model="row.digital" disabled />
    </template>
    <template #cover-data="{ row }">
      <div v-if="row.cover" class="flex gap-3">
        <NuxtLink
          v-for="image in row.cover"
          :key="image"
          :to="$pb.getFileUrl(row, image)"
          target="_blank"
        >
          <img
            class="w-12 h-auto rounded-md"
            :src="$pb.getFileUrl(row, image)"
          />
        </NuxtLink>
      </div>
    </template>
    <template #actions-data="{ row }">
      <div class="space-x-3">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-fluent-list-20-filled"
          @click="handleEditBook(row)"
        />
        <UButton
          color="gray"
          variant="ghost"
          icon="i-fluent-edit-20-filled"
          @click="handleEdit(row)"
        />
        <UButton
          color="red"
          variant="ghost"
          icon="i-fluent-delete-20-filled"
          @click="handleRemove(row)"
        />
      </div>
    </template>
  </UTable>

  <PublicationCreateSlideover
    v-model="createOpen"
    :release="release"
    @change="refresh()"
  />

  <PublicationDetailsSlideover
    v-if="publication"
    v-model="editOpen"
    :publication="publication"
    @change="refresh()"
  />

  <BookDetailsSlideover
    v-if="publication"
    v-model="booksOpen"
    :publication="publication"
    @change="refresh()"
  />

  <PublicationRemoveModal
    v-if="publication"
    v-model="removeOpen"
    :publication="publication"
    @change="refresh()"
  />
</template>
