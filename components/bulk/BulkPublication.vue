<script setup lang="ts">
import { type BulkPublication } from "~/stores/bulk";

const publication = defineModel<BulkPublication>({ required: true });
const props = defineProps<{ release?: string }>();

function append() {
  publication.value.books.push({ ...bulkDefaultBook });
}
</script>

<template>
  <div class="space-y-3">
    <UFormGroup label="Volume">
      <UInput v-model="publication.volume" placeholder="1" />
    </UFormGroup>
    <UFormGroup label="Name">
      <UInput
        v-model="publication.name"
        :placeholder="`${props.release} - Tập 1`"
      />
    </UFormGroup>
    <UFormGroup label="Assets">
      <UInput v-model="publication.asset" type="file" multiple />
    </UFormGroup>
  </div>

  <div class="space-y-3">
    <div v-for="(_, i) in publication.books" class="space-y-3">
      <BulkBook v-model="publication.books[i]" />
    </div>

    <UButton @click.stop="append">More</UButton>
  </div>
</template>
