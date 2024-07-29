<script setup lang="ts">
import {
  Collections,
  type ReleasesResponse,
  type PublishersResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { BulkData } from "@/stores/bulk";

const { $pb } = useNuxtApp();

const release = defineModel<BulkData>({ required: true });

async function releases(q: string) {
  const releases = await $pb.collection(Collections.Releases).getList<
    ReleasesResponse<{
      publisher: PublishersResponse;
      partner: PublishersResponse;
      title: TitlesResponse;
    }>
  >(1, 10, {
    filter: $pb.filter("title.name ~ {:q}", { q }),
    sort: "-updated",
    expand: "publisher, partner, title",
  });

  return releases.items;
}

function append() {
  release.value.publications.push(structuredClone(bulkDefaultPublication));
}

function remove(i: number) {
  release.value.publications.splice(i, 1);
}
</script>

<template>
  <UCard>
    <template #header>
      <UInputMenu
        v-model="release.release"
        :search="releases"
        option-attribute="name"
        by="id"
        placeholder="Choose a release"
      >
        <template #option="{ option }">
          <span class="truncate">
            {{ option.name }}
            <span
              v-if="option.disambiguation"
              class="text-gray-500 dark:text-gray-400"
            >
              {{ " " }}({{ option.disambiguation }})
            </span>
          </span>
        </template>
      </UInputMenu>
    </template>

    <div class="space-y-12">
      <div v-for="(_, i) in release.publications" :key="i" class="flex gap-6">
        <UButton
          icon="i-fluent-delete-20-filled"
          color="red"
          variant="ghost"
          @click.stop="remove(i)"
        />

        <BulkPublication
          v-model="release.publications[i]"
          :release="release.release?.name"
        />
      </div>

      <UButton class="block mx-auto" @click.stop="append">More</UButton>
    </div>
  </UCard>
</template>
