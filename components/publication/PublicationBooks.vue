<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const { publication, booksOpen } = usePublications();

const { pending, data, refresh } = await useLazyAsyncData(
  () =>
    $pb.collection(Collections.Books).getFullList({
      filter: `publication.id='${publication.value?.id}'`,
    }),
  {
    watch: [publication],
    transform: (data) =>
      data.map((book) => ({
        ...book,
        // remove timestamp
        publishDate: book.publishDate.split(" ")[0],
      })),
  },
);
</script>

<template>
  <USlideover v-if="publication" v-model="booksOpen">
    <div class="p-6 overflow-y-scroll">
      <AppH2>
        {{ publication.name }}
        <span class="text-zinc-400">books</span>
      </AppH2>

      <div v-if="pending">
        <UCard class="space-y-6">
          <div class="space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
        </UCard>
      </div>

      <div v-else-if="data" class="space-y-6">
        <BookEditCard
          v-for="book in data"
          :key="book.id"
          :book="book"
          @change="refresh"
        />

        <BookCreateCard @change="refresh" />
      </div>
    </div>
  </USlideover>
</template>
