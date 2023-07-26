<script setup lang="ts">
import {
  Collections,
  type TitleResponse,
  type FormatResponse,
  type PublisherResponse,
  type ReleaseResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const route = useRoute();

const title = await $pb
  .collection(Collections.Title)
  .getOne<TitleResponse>(route.params.titleId as string);

const formats = (
  await $pb.collection(Collections.Format).getFullList<FormatResponse>()
).map((format) => ({
  id: format.id,
  label: format.name,
}));

const {
  pending,
  data: releases,
  refresh,
} = await useLazyAsyncData(
  "releases",
  () =>
    $pb.collection(Collections.Release).getFullList<
      ReleaseResponse<{
        publisher: PublisherResponse;
      }>
    >({
      filter: `title='${route.params.titleId as string}'`,
      expand: "publisher",
    }),
  {
    transform: (data) =>
      structuredClone(data).map((release) => ({
        ...release,
        publisher: release.expand?.publisher.name,
      })),
  },
);

const columns = [
  {
    key: "name",
    label: "Bản in",
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

const createSlideoverOpen = ref(false);
const selectedFormat = ref<{ id: string; label: string } | undefined>(
  formats.find((f) => f.id === title.format),
);
</script>

<template>
  <div v-if="title" class="p-6">
    <AppH1>
      <NuxtLink class="text-zinc-400" to="/title"> Title / </NuxtLink>
      {{ title.name }}
    </AppH1>

    <form class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <UFormGroup name="name" label="Name">
          <UInput v-model="title.name" />
        </UFormGroup>

        <UFormGroup name="format" label="Format">
          <USelectMenu
            v-model="selectedFormat"
            :options="formats || []"
            :loading="pending"
          />
        </UFormGroup>
      </div>
      <UFormGroup name="description" label="Description">
        <UTextarea v-model="title.description" resize disabled />
      </UFormGroup>
    </form>

    <div class="mt-12">
      <AppH2>
        Release
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
            icon="i-fluent-add-20-filled"
            class="float-right"
            @click="createSlideoverOpen = true"
          >
            Create
          </UButton>
        </span>
      </AppH2>
      <UTable :columns="columns" :rows="releases || []" :loading="pending">
        <template #actions-data="{ row }">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-fluent-arrow-right-20-filled"
            :to="`/title/${title.id}/${row.id}`"
          />
        </template>
      </UTable>
    </div>

    <ReleaseCreateSlideover v-model="createSlideoverOpen" :title="title" />
  </div>
</template>
