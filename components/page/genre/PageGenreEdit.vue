<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { genre, isOpen } = useGenrePage();
const { pending, update } = useGenre();

const schema = z.object({
  name: z.string(),
  slug: z.string(),
});

type Schema = z.output<typeof schema>;

const state = ref({
  name: "",
  slug: "",
});

watch([genre], () => {
  state.value = {
    name: genre.value.name,
    slug: genre.value.slug,
  };
});

async function submit(event: FormSubmitEvent<Schema>) {
  await update(genre.value.id, event.data);
}
</script>

<template>
  <USlideover v-model="isOpen.edit">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Update</span>
        {{ genre.name }}
      </AppH2>

      <UForm :schema="schema" :state="state" class="space-y-3" @submit="submit">
        <UFormGroup label="Name">
          <UInput v-model="state.name" />
        </UFormGroup>

        <UFormGroup label="Slug">
          <UInput v-model="state.slug" />
        </UFormGroup>

        <UButton type="submit" :loading="pending">Submit</UButton>
      </UForm>
    </div>
  </USlideover>
</template>
