<script setup lang="ts">
import { Collections, type TitleResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const route = useRoute();

const { data: title, refresh } = await useAsyncData(() =>
  $pb
    .collection(Collections.Title)
    .getOne<TitleResponse>(route.params.titleId as string),
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
        <TitleDetails :title="title" @change="refresh()" />
        <TitleReleases :title="title" />
      </div>
      <div>
        <TitleCover :title="title" @change="refresh()" />
        <TitleWorks :title="title" />
      </div>
    </section>
  </div>
</template>
