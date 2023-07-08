<script setup lang="ts">
import { Record } from "pocketbase";

const { $pb } = useNuxtApp();
const route = useRoute();

const title = await $pb
  .collection("title")
  .getOne(route.params.titleId as string);

const name = ref(title.name);
const description = ref(title.description);
const selectedFormat = ref();

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

const { pending: formatPending, data: formats } = useLazyAsyncData(
  "format",
  async () => await $pb.collection("format").getFullList(),
  {
    transform: (formats) =>
      formats.map((format) => ({
        id: format.id,
        label: format.name,
      })),
  },
);

const { pending: pending, data: releases } = useLazyAsyncData(
  "releases",
  async () =>
    await $pb
      .collection("release")
      .getFullList({ filter: `title = '${title.id}'`, expand: "publisher" }),
  {
    transform: (releases) =>
      releases.map((release) => ({
        ...release,
        publisher: (release.expand.publisher as Record).name,
      })),
  },
);

const unwatch = watch(formats, () => {
  unwatch();
  return (selectedFormat.value = formats.value?.find(
    (f) => f.id === title.format,
  ));
});
</script>

<template>
  <div class="p-6">
    <AppH1>
      <NuxtLink class="text-zinc-400 dark:text-zinc-400" to="/title">
        Danh sách truyện /
      </NuxtLink>
      {{ title.name }}
    </AppH1>

    <form class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <UFormGroup name="name" label="Name">
          <UInput v-model="name" />
        </UFormGroup>

        <UFormGroup name="format" label="Format">
          <USelectMenu
            v-model="selectedFormat"
            :options="formats || []"
            :loading="formatPending"
          />
        </UFormGroup>
      </div>
      <UFormGroup name="description" label="Description">
        <UTextarea v-model="description" resize disabled />
      </UFormGroup>
    </form>

    <div class="mt-12">
      <AppH2>Release</AppH2>
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
  </div>
</template>
