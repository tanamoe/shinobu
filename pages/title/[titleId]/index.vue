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
    <AppBreadcrumb
      :items="[
        { label: 'Title', href: '/title' },
        { label: title.name, active: true },
      ]"
    />

    <section class="flex gap-6">
      <div class="flex-1">
        <PageTitleDetails :title="title" @change="refresh()" />
        <PageTitleReleases :title="title" />
      </div>
      <div>
        <PageTitleCover :title="title" @change="refresh()" />
        <PageTitleWorks :title="title" />
      </div>
    </section>
  </div>
</template>
