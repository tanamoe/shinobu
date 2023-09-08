<script setup lang="ts">
import {
  Collections,
  type TitleResponse,
  type FormatResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { update, pending } = useUpdateTitle();

const props = defineProps<{
  title: TitleResponse;
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
  () => $pb.collection(Collections.Format).getFullList<FormatResponse>(),
  {
    transform: (formats) =>
      formats.map((format) => ({
        value: format.id,
        label: format.name,
      })),
  },
);

async function handleUpdateTitle() {
  const res = await update(props.title.id, state.value);
  if (res) emit("change");
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="handleUpdateTitle">
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
