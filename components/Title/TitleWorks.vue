<script setup lang="ts">
import { Sortable } from "sortablejs-vue3";
import {
  Collections,
  type TitleResponse,
  type StaffResponse,
  type WorkResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { updatePriority } = useWorks();

const props = defineProps<{
  title: TitleResponse;
}>();

const createOpen = ref(false);

const {
  data: works,
  pending,
  refresh,
} = await useAsyncData(() =>
  $pb.collection(Collections.Work).getFullList<
    WorkResponse<{
      staff: StaffResponse;
    }>
  >({
    filter: `title='${props.title.id}'`,
    expand: "staff",
    sort: "+priority",
  }),
);
</script>

<template>
  <section v-if="works" class="mt-12">
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
        <UButton
          color="gray"
          icon="i-fluent-add-square-multiple-20-filled"
          class="float-right"
          @click="createOpen = true"
        >
          Create
        </UButton>
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
            element: WorkResponse<{
              staff: StaffResponse<unknown>;
            }>;
          }"
        >
          <UCard
            :key="element.id"
            class="cursor-grab"
            :ui="{
              body: {
                base: 'prose dark:prose-invert prose-sm',
                padding: 'px-2 py-4 sm:p-3',
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
      <div class="text-right">
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

  <WorkCreateSlideover
    v-model="createOpen"
    :title="title"
    @change="refresh()"
  />
</template>
