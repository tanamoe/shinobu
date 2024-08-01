<script setup lang="ts">
import {
  Collections,
  type AdditionalTitleNamesResponse,
  type TitlesResponse,
} from "@/types/pb";
import { joinURL } from "ufo";

const { $pb } = useNuxtApp();
const route = useRoute();

const {
  data: title,
  status,
  refresh,
} = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getOne<
    TitlesResponse<
      unknown,
      {
        additionalTitleNames_via_title?: AdditionalTitleNamesResponse[];
      }
    >
  >(route.params.titleId as string, {
    expand: "additionalTitleNames_via_title",
  }),
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
        <TitleDetails :title="title" @change="refresh()" />

        <TitleReleases :title="title" @change="refresh" />

        <div class="flex gap-6">
          <TitleLinks class="flex-1" :title="title" />
          <TitleWorks class="flex-1" :title="title" />
          <TitleAdditionalNames class="flex-1" :title @change="refresh" />
        </div>
      </div>
      <div class="space-y-3">
        <TitleCover :title="title" @change="refresh()" />
        <UButton
          :to="joinURL('https://tana.moe/title/', title.slug)"
          target="_blank"
          color="gray"
          icon="i-fluent-window-arrow-up-20-filled"
          block
        >
          Preview
        </UButton>
      </div>
    </section>
  </div>
</template>
