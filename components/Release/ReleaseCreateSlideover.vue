<script setup lang="ts">
import {
  Collections,
  type PublisherResponse,
  ReleaseStatusOptions,
  type TitleResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { pending, create } = useRelease();

const props = defineProps<{
  modelValue: boolean;
  title: TitleResponse;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [void];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const state = ref<{
  title: string;
  name?: string;
  publisher?: string;
  status?: ReleaseStatusOptions;
}>({
  title: props.title.id,
  name: undefined,
  publisher: undefined,
  status: undefined,
});

const { data: publishers } = await useAsyncData(
  async () =>
    await $pb
      .collection(Collections.Publisher)
      .getFullList<PublisherResponse>(),
  {
    transform: (publishers) =>
      publishers.map((publisher) => ({
        value: publisher.id,
        label: publisher.name,
      })),
  },
);

const handleCreate = async () => {
  const res = await create(state.value);

  if (res) {
    emit("change");
    isOpen.value = false;
  }
};
</script>

<template>
  <USlideover v-model="isOpen">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Create a release for</span>
        {{ title.name }}
      </AppH2>

      <form class="space-y-6" @submit.prevent="handleCreate">
        <UFormGroup label="Name">
          <UInput v-model="state.name" name="name" />
        </UFormGroup>
        <UFormGroup label="Publisher">
          <USelect
            v-model="state.publisher"
            :options="publishers || []"
            name="publisher"
          />
        </UFormGroup>
        <UFormGroup label="Status">
          <USelect
            v-model="state.status"
            :options="Object.values(ReleaseStatusOptions)"
            name="status"
          />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </form>
    </div>
  </USlideover>
</template>
