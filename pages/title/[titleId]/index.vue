<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const route = useRoute();

const { data: title, refresh } = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getOne(route.params.titleId as string),
);

if (!title.value)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });

useHead({
  title: title.value.name,
});
</script>

<template>
  <div v-if="title" class="p-6">
    <UBreadcrumb
      class="mb-6"
      :links="[
        { label: 'Title', to: '/title', icon: 'i-fluent-book-20-filled' },
        { label: title.name, to: `/title/${title.id}` },
      ]"
    />

    <section class="flex gap-6">
      <div class="flex-1 space-y-12">
        <PageTitleDetails :title="title" @change="refresh()" />

        <PageTitleReleases :title="title" />

        <div class="flex gap-6">
          <PageTitleLinks class="flex-1" :title="title" />
          <PageTitleWorks class="flex-1" :title="title" />
        </div>
      </div>
      <div>
        <PageTitleCover :title="title" @change="refresh()" />
      </div>
    </section>
  </div>
</template>
