<script setup lang="ts">
import {
  Collections,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const route = useRoute();

const { data: release, refresh } = await useAsyncData(
  route.params.releaseId as string,
  () =>
    $pb
      .collection(Collections.Releases)
      .getOne<ReleasesResponse<{ title: TitlesResponse }>>(
        route.params.releaseId as string,
        {
          expand: "title",
        },
      ),
);

if (!release.value?.expand?.title)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });

useHead({
  title: release.value.expand.title.name + " / " + release.value.name,
});
</script>

<template>
  <div v-if="release && release.expand?.title" class="p-6">
    <AppBreadcrumb
      :items="[
        { label: 'Title', href: '/title' },
        {
          label: release.expand?.title.name,
          href: `/title/${release.expand?.title.id}`,
        },
        { label: release.name, active: true },
      ]"
    />

    <PageReleaseDetails :release="release" @change="refresh()" />

    <PageReleasePublications :release="release" />
  </div>
</template>
