<script setup lang="ts">
import {
  Collections,
  type ReleasesResponse,
  type PublishersResponse,
  type TitlesResponse,
  type FormatsResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const release = defineModel<ReleasesResponse>();

async function releases(q: string) {
  const releases = await $pb.collection(Collections.Releases).getList<
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
    filter: $pb.filter("title.name ~ {:q}", { q }),
    sort: "-created",
    expand: "publisher, partner, title.format",
  });

  return releases.items;
}
</script>

<template>
  <UInputMenu
    v-model="release"
    :search="releases"
    option-attribute="name"
    by="id"
    placeholder="Choose a release"
  >
    <template #option="{ option }">
      <UAvatarGroup
        size="2xs"
        :max="2"
        :ui="{ ring: 'ring-white dark:ring-gray-800' }"
      >
        <UAvatar
          :src="
            $pb.files.getUrl(
              option.expand?.publisher,
              option.expand?.publisher.logo,
            )
          "
          :alt="option.expand?.publisher.name"
        />
        <UAvatar
          v-if="option.expand?.partner"
          :src="
            $pb.files.getUrl(
              option.expand?.partner,
              option.expand?.partner.logo,
            )
          "
          :alt="option.expand?.partner.name"
        />
      </UAvatarGroup>
      <span class="truncate">
        {{ option.name }}
      </span>
      <span
        v-if="option.disambiguation"
        class="text-gray-500 dark:text-gray-400"
      >
        ({{ option.disambiguation }})
      </span>
      <span class="text-gray-500 dark:text-gray-400">
        {{ option.expand.title.expand.format.name }}
      </span>
      <UBadge v-if="option.digital" color="red">Digital</UBadge>
      <UBadge variant="soft">{{ option.status }}</UBadge>
    </template>
  </UInputMenu>
</template>
