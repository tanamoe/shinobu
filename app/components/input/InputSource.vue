<script setup lang="ts">
import { Collections, type LinkSourcesResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { create } = useStaff();

const model = defineModel<string>();

const query = ref("");
const queryDebounced = refDebounced(query, 200);

const {
  data: sources,
  status,
  execute,
} = await useAsyncData(
  () =>
    $pb
      .collection(Collections.LinkSources)
      .getList<LinkSourcesResponse>(1, 15, {
        filter: $pb.filter("name ~ {:name}", { name: queryDebounced.value }),
        sort: "-updated",
      }),
  {
    transform: (data) =>
      data.items.map((source) => ({
        value: source.id,
        label: source.name,
        avatar: {
          src: $pb.files.getUrl(source, source.icon),
        },
      })),
    watch: [queryDebounced],
  },
);

function onOpen() {
  if (!sources.value?.length) {
    execute();
  }
}

async function onCreate(name: string) {
  const staff = await create({ name });

  if (staff) {
    model.value = staff.id;
    execute();
  }
}
</script>

<template>
  <UInputMenu
    v-model="model"
    v-model:search-term="query"
    :items="sources || []"
    :loading="status === 'pending'"
    ignore-filter
    create-item
    value-key="value"
    @on-open="onOpen"
    @create="onCreate"
  />
</template>
