<script setup lang="ts">
const { data, push, latest } = useBulkStore();

function append() {
  push({
    ...bulkDefaultData,
    priority: latest().priority + 1,
  });
}

useHead({
  title: "Title listing",
});
</script>

<template>
  <div class="p-6 max-h-screen">
    <UBreadcrumb
      class="mb-6"
      :links="[
        {
          label: 'Bulk Create',
          to: '/tools/bulk',
          icon: 'i-fluent-book-20-filled',
        },
      ]"
    />

    <div class="space-y-6">
      <template v-for="(_, i) in data">
        <BulkRelease v-model="data[i]"></BulkRelease>
      </template>

      <UButton @click.stop="append">More</UButton>
    </div>
  </div>
</template>
