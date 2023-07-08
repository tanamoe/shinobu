<script setup lang="ts">
import { Record } from "pocketbase";

const { $pb } = useNuxtApp();
const route = useRoute();

const title = await $pb
  .collection("title")
  .getOne(route.params.titleId as string);

const release = await $pb
  .collection("release")
  .getOne(route.params.releaseId as string);

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
    key: "edition",
    label: "Edition",
  },
  {
    key: "publish_date",
    label: "Publish date",
  },
  {
    key: "price",
    label: "Price",
  },
];

const { pending, data: books } = useLazyAsyncData(
  "book",
  async () =>
    await $pb.collection("book").getFullList({
      filter: `publication.release  = '${release.id}'`,
      sort: "publication.volume,edition",
      expand: "publication",
    }),
  {
    transform: (books) =>
      books.map((book) => ({
        ...book,
        name: (book.expand.publication as Record).name,
        volume:
          (book.expand.publication as Record).volume / 10000 +
          ((book.expand.publication as Record).volume % 10) * 0.1,
        cover: book.cover ?? (book.expand.publication as Record).cover,
      })),
  },
);
</script>

<template>
  <div class="p-6">
    <AppH1>
      <NuxtLink class="text-zinc-400 dark:text-zinc-400" to="/title">
        Danh sách truyện /
      </NuxtLink>
      <NuxtLink
        class="text-zinc-400 dark:text-zinc-400"
        :to="`/title/${title.id}`"
      >
        {{ title.name }} /
      </NuxtLink>
      {{ release.name }}
    </AppH1>

    <UTable :columns="columns" :rows="books || []" :loading="pending"></UTable>
  </div>
</template>
