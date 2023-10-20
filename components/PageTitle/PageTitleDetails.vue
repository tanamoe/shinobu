<script setup lang="ts">
import { Collections, type TitlesResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { update, pending } = useTitle();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [void];
}>();

const { data: formats } = await useLazyAsyncData(
  () => $pb.collection(Collections.Formats).getFullList(),
  {
    transform: (formats) =>
      formats.map((format) => ({
        value: format.id,
        label: format.name,
      })),
  },
);

const { data: genres } = await useLazyAsyncData(
  () => $pb.collection(Collections.Genres).getFullList(),
  {
    transform: (genres) =>
      genres.map((genre) => ({
        id: genre.id,
        name: genre.name,
      })),
  },
);

const state = ref({
  name: props.title.name,
  format: props.title.format,
  description: props.title.description,
  genres: props.title.genres,
});

const selected = computed(
  () => genres.value?.filter((genre) => state.value.genres.includes(genre.id)),
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
      <UFormGroup class="col-span-2" name="genres" label="Genres">
        <USelectMenu
          v-model="state.genres"
          :options="genres || []"
          value-attribute="id"
          option-attribute="name"
          multiple
          searchable
        >
          <template #label>
            <span v-if="selected && selected.length > 0">
              {{ selected.map((genre) => genre.name).join(", ") }}
            </span>
            <span v-else>None genres selected</span>
          </template>
        </USelectMenu>
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
