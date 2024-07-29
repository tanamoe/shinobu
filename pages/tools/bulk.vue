<script setup lang="ts">
const { data, push, latest } = useBulkStore();

const _publication = usePublication();
const _book = useBook();

function append() {
  const dd = structuredClone(bulkDefaultData);
  dd.priority = latest().priority + 1;
  push(dd);
}

async function save() {
  for (const release of data) {
    for (const publication of release.publications) {
      const publicationResponse = await _publication.create({
        ...publication,
        name:
          publication.name != ""
            ? publication.name
            : `${release.release?.name} - Tập ${publication.volume || 1}`,
        volume: (publication.volume ? parseInt(publication.volume) : 0) * 10000,
        release: release.release?.id,
      });

      if (publicationResponse) {
        for (const [i, book] of publication.books.entries()) {
          const bookResponse = await _book.create({
            ...book,
            price: parseInt(book.price) ?? 0,
            publication: publicationResponse.id,
          });

          if (bookResponse && i == 1) {
            await _publication.update(publicationResponse.id, {
              defaultBook: bookResponse.id,
            });
          }
        }
      }
    }
  }
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

      <UButton class="block mx-auto" @click.stop="append">More</UButton>

      <UButton class="block mx-auto" @click.stop="save">Save</UButton>
    </div>
  </div>
</template>
