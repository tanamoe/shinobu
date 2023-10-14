<script setup lang="ts">
import {
  Collections,
  type TitlesResponse,
  type FormatsResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { update, pending } = useTitle();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [void];
}>();

const state = ref({
  name: props.title.name,
  format: props.title.format,
  description: props.title.description,
});

const { data: formats } = await useAsyncData(
  () => $pb.collection(Collections.Formats).getFullList<FormatsResponse>(),
  {
    transform: (formats) =>
      formats.map((format) => ({
        value: format.id,
        label: format.name,
      })),
  },
);

async function handleUpdate() {
  const res = await update(props.title.id, state.value);
  if (res) emit("change");
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="handleUpdate">
    <div class="grid grid-cols-2 gap-3">
      <UFormGroup name="name" label="Name">
        <UInput v-model="state.name" />
      </UFormGroup>

      <UFormGroup name="format" label="Format">
        <USelect v-model="state.format" :options="formats || []" />
      </UFormGroup>
    </div>

    <AppEditor v-model="state.description" />

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
