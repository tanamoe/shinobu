<script setup lang="ts">
import type { BooksRecord } from "@/types/pb";

const book = defineModel<
  Pick<BooksRecord, "edition" | "publishDate"> & {
    price: string;
  }
>({ required: true });
</script>

<template>
  <div class="space-y-3">
    <UFormField label="Edition">
      <UInput v-model="book.edition" />
    </UFormField>
    <div class="grid grid-cols-2 gap-3">
      <UFormField label="Price" name="price">
        <UInput v-model="book.price" type="number">
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs">VND</span>
          </template>
        </UInput>
      </UFormField>
      <UFormField label="Publish Date">
        <UInput v-model="book.publishDate" type="date" />
      </UFormField>
    </div>
  </div>
</template>
