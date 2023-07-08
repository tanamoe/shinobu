<script setup lang="ts">
import type { Record } from "pocketbase";

const { $pb } = useNuxtApp();

const data = ref();
const release = ref();

const props = defineProps<{
  modelValue: boolean;
  title: Partial<Record>;
}>();
defineEmits<{
  "update:modelValue": [value: boolean];
  created: [void];
}>();

const { pending: publishersPending, data: publishers } = useLazyAsyncData(
  "publishers",
  async () => await $pb.collection("publisher").getFullList(),
  {
    transform: (publishers) =>
      publishers.map((publisher) => ({
        id: publisher.id,
        label: publisher.name,
      })),
  },
);

watch(
  () => props.modelValue,
  (value) => {
    if (value === false) release.value = {};
    else {
      data.value = props.title;
      release.value = {
        title: data.value.id,
      };
    }
  },
);
</script>

<template>
  <USlideover
    :model-value="modelValue"
    @update:model-value="
      (value: boolean) => {
        $emit('update:modelValue', value);
      }
    "
  >
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Create a release for</span>
        {{ data.name }}
      </AppH2>

      <form
        class="space-y-6"
        @submit.prevent="
          async () => {
            await createRelease({
              ...release,
              publisher: release.publisher.id,
            });
            $emit('created');
          }
        "
      >
        <UFormGroup name="name" label="Name">
          <UInput v-model="release.name" />
        </UFormGroup>
        <UFormGroup name="publisher" label="Publisher">
          <USelectMenu
            v-model="release.publisher"
            :options="publishers || []"
            :loading="publishersPending"
          />
        </UFormGroup>
        <UFormGroup name="status" label="Status">
          <USelectMenu
            v-model="release.status"
            :options="[
              'WAITING_FOR_APPROVAL',
              'REGISTERED',
              'LICENSED',
              'ON_GOING',
              'COMPLETED',
              'HIATUS',
              'CANCELLED',
            ]"
          />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" />
        </div>
      </form>
    </div>
  </USlideover>
</template>
