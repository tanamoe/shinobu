<script setup lang="ts">
import { Collections } from "@/types/pb";

const { $pb } = useNuxtApp();
const route = useRoute();

const { data: title } = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getOne(route.params.titleId as string),
);

if (!title.value)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });

const { data: release, refresh } = await useAsyncData(() =>
  $pb.collection(Collections.Releases).getOne(route.params.releaseId as string),
);

if (!release.value)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });

useHead({
  title: title.value.name + " / " + release.value.name,
});
</script>

<template>
  <div v-if="release && title" class="p-6">
    <AppBreadcrumb
      :items="[
        { label: 'Title', href: '/title' },
        { label: title.name, href: `/title/${title.id}` },
        { label: release.name, active: true },
      ]"
    />

    <PageReleaseDetails :release="release" @change="refresh()" />

    <PageReleasePublications :title="title" :release="release" />
  </div>
</template>
