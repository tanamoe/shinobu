<script setup lang="ts">
import {
  Collections,
  type TitlesResponse,
  type PublicationsResponse,
  type ReleasesResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { publication, edit, remove, books } = usePublications();

const props = defineProps<{
  release: ReleasesResponse<{
    title: TitlesResponse;
  }>;
}>();

const { data: publications, refresh } = await useLazyAsyncData(() =>
  $pb.collection(Collections.Publications).getFullList<PublicationsResponse>({
    filter: `release.id = '${props.release.id}'`,
    sort: "-volume",
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
    key: "covers",
    label: "Covers",
  },
  {
    key: "actions",
  },
];
</script>

<template>
  <div class="flex items-center justify-end gap-3 mt-12">
    <PublicationQuickCreate :release="release" @change="refresh()" />
    <PublicationCreate :release="release" @change="refresh()" />
  </div>

  <UTable :columns="columns" :rows="publications || []">
    <template #volume-data="{ row }">
      <UBadge color="gray">
        {{ Math.floor(row.volume / 10000) + (row.volume % 10) * 0.1 }}
      </UBadge>
    </template>
    <template #name-data="{ row }">
      {{ row.name }}
      <UBadge v-if="row.digital">Digital</UBadge>
    </template>
    <template #covers-data="{ row }">
      <div v-if="row.covers" class="flex gap-3">
        <NuxtLink
          v-for="cover in row.covers"
          :key="cover"
          :to="$pb.getFileUrl(row, cover)"
          target="_blank"
        >
          <img
            class="w-12 h-auto rounded-md"
            :src="$pb.getFileUrl(row, cover, { thumb: '100x100' })"
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
          @click="books(row)"
        />
        <UButton
          color="gray"
          variant="ghost"
          icon="i-fluent-edit-20-filled"
          square
          @click="edit(row)"
        />
        <UButton
          color="red"
          variant="ghost"
          icon="i-fluent-delete-20-filled"
          @click="remove(row)"
        />
      </div>
    </template>
  </UTable>

  <PublicationBooks v-if="publication" @change="refresh()" />

  <PublicationEdit @change="refresh()" />

  <PublicationRemove @change="refresh()" />
</template>
