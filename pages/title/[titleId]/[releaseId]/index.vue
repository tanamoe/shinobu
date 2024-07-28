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
      .getOne<
        ReleasesResponse<{ title: TitlesResponse }>
      >(route.params.releaseId as string, {
        expand: "title",
      }),
);

if (!release.value?.expand?.title)
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });

useHead({
  title: release.value.expand.title.name + " / " + release.value.name,
});
</script>

<template>
  <div v-if="release && release.expand?.title" class="p-6">
    <UBreadcrumb
      class="mb-6"
      :links="[
        { label: 'Title', to: '/title', icon: 'i-fluent-book-20-filled' },
        { label: release.expand?.title.name, to: `/title/${release.title}` },
        { label: release.name, to: `/title/${release.title}/${release.id}` },
      ]"
    />

    <ReleaseDetails :release="release" @change="refresh()" />

    <ReleasePublications :release="release" />
  </div>
</template>
