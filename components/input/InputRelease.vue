<script setup lang="ts">
import {
  Collections,
  type FormatsResponse,
  type PublishersResponse,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const release = defineModel<
  ReleasesResponse<{
    publisher: PublishersResponse;
    partner: PublishersResponse;
    title: TitlesResponse<
      unknown,
      {
        format: FormatsResponse;
      }
    >;
  }>
>();

const query = ref("");
const queryDebounced = refDebounced(query, 500);

const { data, status } = await useLazyAsyncData(
  () =>
    $pb.collection(Collections.Releases).getList<
      ReleasesResponse<{
        publisher: PublishersResponse;
        partner: PublishersResponse;
        title: TitlesResponse<
          unknown,
          {
            format: FormatsResponse;
          }
        >;
      }>
    >(1, 10, {
      filter: $pb.filter("title.name ~ {:q}", { q: queryDebounced.value }),
      sort: "-created",
      expand: "publisher, partner, title.format",
    }),
  { watch: [queryDebounced] },
);
</script>

<template>
  <UInputMenu
    v-model="release"
    v-model:search-term="query"
    :items="data?.items"
    :loading="status === 'pending'"
    ignore-filter
    label-key="name"
    placeholder="Choose a release"
  >
    <template #item="{ item }">
      <UAvatarGroup
        v-if="item.expand?.publisher || item.expand?.partner"
        size="2xs"
        :max="2"
      >
        <UAvatar
          :src="
            $pb.files.getUrl(item.expand.publisher, item.expand.publisher.logo)
          "
          :alt="item.expand.publisher.name"
        />
        <UAvatar
          v-if="item.expand.partner"
          :src="$pb.files.getUrl(item.expand.partner, item.expand.partner.logo)"
          :alt="item.expand.partner.name"
        />
      </UAvatarGroup>
      <span class="truncate">
        {{ item.name }}
      </span>
      <span v-if="item.disambiguation" class="text-gray-500 dark:text-gray-400">
        ({{ item.disambiguation }})
      </span>
      <span class="text-gray-500 dark:text-gray-400">
        {{ item.expand?.title.expand?.format.name }}
      </span>
      <UBadge v-if="item.digital" color="error">Digital</UBadge>
      <UBadge variant="soft">{{ item.status }}</UBadge>
    </template>
  </UInputMenu>
</template>
