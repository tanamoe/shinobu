<script setup lang="ts">
import type { BulkPublication } from "~/stores/bulk";

const publication = defineModel<BulkPublication>({ required: true });
const props = defineProps<{ release?: string }>();

function append() {
  const { edition, price, publishDate } =
    publication.value.books.at(-1) ?? bulkDefaultBook;
  publication.value.books.push({
    edition,
    price,
    publishDate,
  });
}

function remove(i: number) {
  publication.value.books.splice(i, 1);
}
</script>

<template>
  <div class="grid grid-cols-2 gap-6">
    <div class="space-y-3">
      <UFormField label="Volume">
        <UInput v-model="publication.volume" placeholder="1" />
      </UFormField>
      <UFormField label="Name">
        <UInput
          v-model="publication.name"
          :placeholder="`${props.release} - Tập ${publication.volume || 1}`"
        />
      </UFormField>
    </div>

    <div class="space-y-6">
      <div v-for="(_, i) in publication.books" :key="i" class="flex gap-6">
        <BulkBook v-model="publication.books[i]" />
        <UButton
          icon="i-fluent-delete-20-filled"
          color="error"
          variant="ghost"
          @click.stop="remove(i)"
        />
      </div>

      <UButton class="block mx-auto" @click.stop="append">More</UButton>
    </div>
  </div>
</template>
