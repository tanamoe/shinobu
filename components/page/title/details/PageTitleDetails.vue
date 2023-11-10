<script setup lang="ts">
import { type TitlesResponse } from "@/types/pb";

const { update, pending } = useTitle();
const { state } = useTitlePage();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [void];
}>();

state.value = {
  name: props.title.name,
  description: props.title.description,
  format: props.title.format,
  genres: props.title.genres,
  demographic: props.title.demographic,
};

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
      <PageTitleDetailsFormat />
      <PageTitleDetailsGenres />
      <PageTitleDetailsDemographic />
    </div>

    <ClientOnly>
      <AppEditor v-model="state.description" />
      <template #fallback>
        <USkeleton class="w-full h-[40vh] rounded-md" />
      </template>
    </ClientOnly>

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
