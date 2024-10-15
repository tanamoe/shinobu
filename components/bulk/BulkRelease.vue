<script setup lang="ts">
import type { BulkData } from "@/stores/bulk";

const release = defineModel<BulkData>({ required: true });

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
      <InputRelease v-model="release.release" />
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
