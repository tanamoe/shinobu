<script setup lang="ts">
import { Collections, type TitleResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const route = useRoute();

const { data: title, execute } = await useAsyncData(() =>
  $pb
    .collection(Collections.Title)
    .getOne<TitleResponse>(route.params.titleId as string),
);

if (!title.value)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
</script>

<template>
  <div v-if="title" class="p-6">
    <AppH1>
      <NuxtLink class="text-zinc-400" to="/title"> Title / </NuxtLink>
      {{ title.name }}
    </AppH1>

    <section class="flex gap-6">
      <div class="flex-1">
        <TitleDetails :title="title" @change="execute()" />
        <TitleReleases :title="title" />
      </div>
      <div>
        <TitleCover :title="title" @change="execute()" />
        <TitleWorks :title="title" />
      </div>
    </section>
  </div>
</template>
