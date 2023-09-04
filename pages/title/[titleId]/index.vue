<script setup lang="ts">
import {
  type BaseSystemFields,
  Collections,
  type TitleResponse,
  type FormatResponse,
  type PublisherResponse,
  type ReleaseResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const route = useRoute();
const { update, pending: updatePending } = useUpdateTitle();

const { data: title, execute } = await useAsyncData(() =>
  $pb
    .collection(Collections.Title)
    .getOne<TitleResponse>(route.params.titleId as string),
);

if (!title.value)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });

const { data: formats } = await useAsyncData(
  () => $pb.collection(Collections.Format).getFullList<FormatResponse>(),
  {
    transform: (formats) =>
      formats.map((format) => ({
        value: format.id,
        label: format.name,
      })),
  },
);

const {
  pending,
  data: releases,
  refresh,
} = await useAsyncData(
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
      data.map((release) => ({
        ...release,
        publisher: release.expand?.publisher.name,
      })),
  },
);

async function handleUpdateTitle(e: Event) {
  const formData = new FormData(e.target as HTMLFormElement);
  formData.append("description", title.value!.description);
  await update(title.value!.id, formData);
  execute();
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

const createSlideoverOpen = ref(false);

watch([createSlideoverOpen], () => refresh());
</script>

<template>
  <div v-if="title" class="p-6">
    <AppH1>
      <NuxtLink class="text-zinc-400" to="/title"> Title / </NuxtLink>
      {{ title.name }}
    </AppH1>

    <form class="space-y-3" @submit.prevent="handleUpdateTitle">
      <div class="grid grid-cols-2 gap-3">
        <UFormGroup name="name" label="Name">
          <UInput v-model="title.name" />
        </UFormGroup>

        <UFormGroup name="format" label="Format">
          <USelect v-model="title.format" :options="formats || []" />
        </UFormGroup>
      </div>

      <UFormGroup name="description" label="Description">
        <AppEditor v-model="title.description" />
      </UFormGroup>

      <UCard
        v-if="title.cover"
        :ui="{
          body: { base: 'flex items-center', padding: '' },
        }"
      >
        <img
          class="w-16 h-auto rounded-md"
          :src="$pb.files.getUrl(title, title.cover, { thumb: '100x100' })"
        />
        <div
          class="flex-1 w-full flex px-3 gap-3 items-center justify-between overflow-hidden"
        >
          <div class="text-ellipsis overflow-hidden">
            {{ title.cover }}
          </div>
          <UButton
            color="red"
            variant="ghost"
            icon="i-fluent-delete-20-filled"
            @click="title.cover = ''"
          />
        </div>
      </UCard>

      <UFormGroup name="cover">
        <UInput type="file" :disabled="title.cover !== ''" />
      </UFormGroup>

      <div class="text-right">
        <UButton
          color="gray"
          icon="i-fluent-save-20-filled"
          :loading="updatePending"
          type="submit"
        >
          Save
        </UButton>
      </div>
    </form>

    <section v-if="releases" class="mt-12">
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
            color="gray"
            icon="i-fluent-add-square-multiple-20-filled"
            class="float-right"
            @click="createSlideoverOpen = true"
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

    <ReleaseCreateSlideover v-model="createSlideoverOpen" :title="title" />
  </div>
</template>
