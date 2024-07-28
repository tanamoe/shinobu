<script setup lang="ts">
import {
  Collections,
  type LinkSourcesResponse,
  type LinksResponse,
  type TitlesResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();

const props = defineProps<{
  title: TitlesResponse;
}>();

const {
  data: links,
  status,
  refresh,
} = await useLazyAsyncData(() =>
  $pb.collection(Collections.Links).getFullList<
    LinksResponse<{
      source: LinkSourcesResponse;
    }>
  >({
    filter: $pb.filter("title = {:title}", { title: props.title.id }),
    expand: "source",
  }),
);
</script>

<template>
  <section v-if="links">
    <AppH2>
      Links
      <span class="float-right space-x-3">
        <UButton
          variant="ghost"
          color="gray"
          icon="i-fluent-arrow-clockwise-20-filled"
          :loading="status === 'pending'"
          @click="refresh()"
        >
          Refresh
        </UButton>
        <PageTitleLinkCreate :title="title" @change="refresh" />
      </span>
    </AppH2>
    <div v-for="link in links" :key="link.id" class="space-y-3">
      <UCard
        :ui="{
          body: {
            base: 'prose dark:prose-invert prose-sm prose-img:my-0',
          },
        }"
      >
        <div
          v-if="link.expand?.source"
          class="font-bold flex items-center gap-3"
        >
          <img
            :src="
              $pb.files.getUrl(link.expand.source, link.expand.source.icon, {
                thumb: '50x50',
              })
            "
            loading="lazy"
            class="w-auto h-4"
          />
          {{ link.expand.source.name }}
        </div>
        <NuxtLink
          :to="link.url"
          target="_blank"
          class="underline text-zinc-600 dark:text-zinc-400"
        >
          {{ link.url }}
        </NuxtLink>
      </UCard>
    </div>
  </section>
</template>
