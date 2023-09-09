<script setup lang="ts">
import {
  Collections,
  type BaseSystemFields,
  type TitleResponse,
  type ReleaseResponse,
  type PublisherResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();

const props = defineProps<{
  title: TitleResponse;
}>();

const createOpen = ref(false);

const {
  pending,
  data: releases,
  refresh,
} = await useAsyncData(
  () =>
    $pb.collection(Collections.Release).getFullList<
      ReleaseResponse<{
        publisher: PublisherResponse;
      }>
    >({
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
  <section v-if="releases" class="mt-12">
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
        <UButton
          color="gray"
          icon="i-fluent-add-square-multiple-20-filled"
          class="float-right"
          @click="createOpen = true"
        >
          Create
        </UButton>
      </span>
    </AppH2>

    <UTable
      :columns="columns"
      :rows="releases"
      :loading="pending"
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

  <ReleaseCreateSlideover
    v-model="createOpen"
    :title="title"
    @change="refresh()"
  />
</template>
