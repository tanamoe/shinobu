<script setup lang="ts">
import { Collections } from "@/types/pb";
import type { BulkData } from "~/stores/bulk";

const { $pb } = useNuxtApp();

const release = defineModel<BulkData>({ required: true });

async function releases(q: string) {
  const releases = await $pb.collection(Collections.Releases).getList(1, 10, {
    filter: $pb.filter("title.name ~ {:q}", { q }),
    expand: "title",
  });

  return releases.items;
}

function append() {
  release.value.publications.push({
    ...bulkDefaultPublication,
    volume: (release.value.publications.at(-1)?.volume ?? 0) + 1,
  });
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
        <template #option="{ option: release }">
          <span class="truncate">
            {{ release.expand.title.name }} -
            <span class="text-gray-500 dark:text-gray-400">
              {{ release.name }}
            </span>
          </span>
        </template>
      </UInputMenu>
    </template>

    <div v-for="(_, i) in release.publications" class="grid grid-cols-2 gap-3">
      <BulkPublication
        v-model="release.publications[i]"
        :release="release.release?.name"
      />
    </div>

    <UButton @click.stop="append">More</UButton>
  </UCard>
</template>
