<script setup lang="ts">
import slug from "slug";
import { type TitlesResponse } from "@/types/pb";

const { update, pending } = useTitle();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const state = ref({
  name: props.title.name,
  description: props.title.description,
  format: props.title.format,
  genres: props.title.genres,
  demographic: props.title.demographic,
  slugGroup: props.title.slugGroup,
});

function generateSlug() {
  state.value.slugGroup = slug(state.value.name);
}

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
      <UFormGroup name="Format" label="Format">
        <InputFormat v-model="state.format" />
      </UFormGroup>
      <UFormGroup name="genres" label="Genres">
        <InputGenre v-model="state.genres" multiple />
      </UFormGroup>
      <UFormGroup name="demographic" label="Demographic">
        <InputDemographic v-model="state.demographic" />
      </UFormGroup>
    </div>

    <div class="flex items-end gap-3">
      <UFormGroup name="slugGroup" label="Slug" class="flex-1">
        <UInput v-model="state.slugGroup" />
      </UFormGroup>
      <UButton
        icon="i-fluent-sparkle-20-filled"
        color="gray"
        @click="generateSlug"
      />
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
