<script setup lang="ts">
import {
  Collections,
  type PublisherResponse,
  ReleaseStatusOptions,
  type ReleaseResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { update, pending } = useRelease();

const props = defineProps<{
  release: ReleaseResponse;
}>();

const emit = defineEmits<{
  change: [void];
}>();

const state = ref({
  name: props.release.name,
  status: props.release.status,
  publisher: props.release.publisher,
});

const { data: publishers } = await useAsyncData(
  () => $pb.collection(Collections.Publisher).getFullList<PublisherResponse>(),
  {
    transform: (formats) =>
      formats.map((format) => ({
        value: format.id,
        label: format.name,
      })),
  },
);

async function handleUpdate() {
  const res = await update(props.release.id, state.value);
  if (res) emit("change");
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="handleUpdate">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <UFormGroup name="name" label="Name">
        <UInput v-model="state.name" />
      </UFormGroup>

      <UFormGroup name="status" label="Status">
        <USelect
          v-model="state.status"
          :options="Object.values(ReleaseStatusOptions)"
        />
      </UFormGroup>

      <UFormGroup name="publisher" label="Publisher">
        <USelect v-model="state.publisher" :options="publishers || []" />
      </UFormGroup>
    </div>

    <div class="text-right">
      <UButton
        color="gray"
        icon="i-fluent-save-20-filled"
        :loading="pending"
        type="submit"
      >
        Save
      </UButton>
    </div>
  </form>
</template>
