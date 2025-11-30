<script setup lang="ts">
import { Collections, type StaffsResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { create } = useStaff();

const model = defineModel<string>();

const query = ref("");
const queryDebounced = refDebounced(query, 200);

const {
  data: staffs,
  status,
  execute,
} = await useAsyncData(
  () =>
    $pb.collection(Collections.Staffs).getList<StaffsResponse>(1, 15, {
      filter: $pb.filter("name ~ {:name}", { name: queryDebounced.value }),
      sort: "-updated",
    }),
  {
    transform: (data) =>
      data.items.map((staff) => ({
        value: staff.id,
        label: staff.name,
      })),
    watch: [queryDebounced],
  },
);

function onOpen() {
  if (!staffs.value?.length) {
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
    :items="staffs || []"
    :loading="status === 'pending'"
    ignore-filter
    create-item
    value-key="value"
    @on-open="onOpen"
    @create="onCreate"
  />
</template>
