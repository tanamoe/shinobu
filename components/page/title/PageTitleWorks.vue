<script setup lang="ts">
import { Sortable } from "sortablejs-vue3";
import {
  Collections,
  type TitlesResponse,
  type StaffsResponse,
  type WorksResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { updatePriority } = useWorks();

const props = defineProps<{
  title: TitlesResponse;
}>();

const {
  data: works,
  pending,
  refresh,
} = await useLazyAsyncData(() =>
  $pb.collection(Collections.Works).getFullList<
    WorksResponse<{
      staff: StaffsResponse;
    }>
  >({
    filter: `title='${props.title.id}'`,
    expand: "staff",
    sort: "+priority",
  }),
);
</script>

<template>
  <section v-if="works">
    <AppH2>
      Staff
      <span class="float-right space-x-3">
        <UButton
          variant="ghost"
          color="gray"
          icon="i-fluent-arrow-clockwise-20-filled"
          :loading="pending"
          @click="refresh()"
        >
          Refresh
        </UButton>
        <PageTitleWorkCreate :title="title" @change="refresh" />
      </span>
    </AppH2>

    <ClientOnly>
      <Sortable
        :list="works"
        item-key="id"
        tag="div"
        class="space-y-3"
        @end="(e) => moveItemInArray(works!, e.oldIndex, e.newIndex)"
      >
        <template
          #item="{
            element,
          }: {
            element: WorksResponse<{
              staff: StaffsResponse<unknown>;
            }>;
          }"
        >
          <UCard
            :key="element.id"
            class="cursor-grab"
            :ui="{
              body: {
                base: 'prose dark:prose-invert prose-sm',
              },
            }"
          >
            <div class="font-bold">
              {{ element.name }}
            </div>
            <div>{{ element.expand!.staff.name }}</div>
          </UCard>
        </template>
      </Sortable>
      <div class="text-right mt-3">
        <UButton
          color="gray"
          icon="i-fluent-save-20-filled"
          @click="updatePriority(works)"
        >
          Save
        </UButton>
      </div>
    </ClientOnly>
  </section>
</template>
