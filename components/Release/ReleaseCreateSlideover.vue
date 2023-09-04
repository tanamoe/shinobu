<script setup lang="ts">
import {
  Collections,
  PublisherResponse,
  ReleaseStatusOptions,
  type TitleResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { pending, create } = useCreateRelease();

const props = defineProps<{
  modelValue: boolean;
  title: TitleResponse;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const title = computed(() => props.title);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const { pending: publishersPending, data: publishers } = await useAsyncData(
  "publishers",
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

const currentPublisher = ref();

const handleCreate = async (e: Event) => {
  const formData = new FormData(e.target as HTMLFormElement);
  formData.append("title", title.value.id);
  await create(formData);
  isOpen.value = false;
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
        <UFormGroup name="name" label="Name">
          <UInput />
        </UFormGroup>
        <UFormGroup name="publisher" label="Publisher">
          <USelect
            v-model="currentPublisher"
            :options="publishers || []"
            :loading="publishersPending"
          />
        </UFormGroup>
        <UFormGroup name="status" label="Status">
          <USelect :options="Object.values(ReleaseStatusOptions)" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </form>
    </div>
  </USlideover>
</template>
