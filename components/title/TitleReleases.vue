<script setup lang="ts">
import {
  Collections,
  type BaseSystemFields,
  type TitlesResponse,
  type ReleasesResponse,
  type PublishersResponse,
} from "@/types/pb";
import { SlideoverReleaseCreate } from "#components";

const { $pb } = useNuxtApp();
const slideover = useSlideover();

const props = defineProps<{
  title: TitlesResponse;
}>();

const {
  data: releases,
  status,
  refresh,
} = await useLazyAsyncData(
  () =>
    $pb
      .collection(Collections.Releases)
      .getFullList<ReleasesResponse<{ publisher: PublishersResponse }>>({
        filter: $pb.filter("title = {:title}", {
          title: props.title.id,
        }),
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

function create(title: TitlesResponse) {
  slideover.open(SlideoverReleaseCreate, { title, onChange: () => refresh() });
}

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
          :loading="status === 'pending'"
          @click="refresh()"
        >
          Refresh
        </UButton>
        <UButton
          color="gray"
          icon="i-fluent-add-square-multiple-20-filled"
          class="float-right"
          @click="create(title)"
        >
          Create
        </UButton>
      </span>
    </AppH2>

    <UTable
      :columns="columns"
      :rows="releases"
      class="dark:divide-gray-700 gap-1 rounded-md border border-gray-300 dark:border-gray-700"
      @select="
        (row: BaseSystemFields) => navigateTo(`/title/${title.id}/${row.id}`)
      "
    >
      <template #name-data="{ row }">
        <span>{{ row.name }}</span>

        <span v-if="row.disambiguation" class="text-sm">
          {{ " " }}({{ row.disambiguation }})
        </span>

        <UBadge v-if="row.digital" color="red" class="ml-3">Digital</UBadge>
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
  </section>
</template>
