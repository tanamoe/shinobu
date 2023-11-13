<script setup lang="ts">
import {
  Collections,
  type BaseSystemFields,
  type TitlesResponse,
  type ReleasesResponse,
  type PublishersResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();

const props = defineProps<{
  title: TitlesResponse;
}>();

const {
  pending,
  data: releases,
  refresh,
} = await useLazyAsyncData(
  () =>
    $pb
      .collection(Collections.Releases)
      .getFullList<ReleasesResponse<{ publisher: PublishersResponse }>>({
        filter: `title='${props.title.id}'`,
        expand: "publisher",
      }),
  {
    transform: (data) =>
      data.map((release) => ({
        ...release,
        publisher: release.expand?.publisher.name,
      })),
  },
);

const columns = [
  {
    key: "name",
    label: "Print release",
  },
  {
    key: "publisher",
    label: "Publisher",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "actions",
  },
];
</script>

<template>
  <section v-if="releases">
    <AppH2>
      Releases
      <span class="float-right space-x-3">
        <UButton
          variant="ghost"
          color="gray"
          icon="i-fluent-arrow-clockwise-20-filled"
          :loading="pending"
          @click="refresh()"
        >
          Refresh
        </UButton>

        <PageTitleReleaseCreate :title="title" @change="refresh" />
      </span>
    </AppH2>

    <UTable
      :columns="columns"
      :rows="releases"
      class="dark:divide-gray-700 gap-1 rounded-md border border-gray-300 dark:border-gray-700"
      @select="
        (row: BaseSystemFields) => navigateTo(`/title/${title!.id}/${row.id}`)
      "
    >
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
  </section>
</template>
