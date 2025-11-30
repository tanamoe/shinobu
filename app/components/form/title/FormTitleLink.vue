<script setup lang="ts">
import { z } from "zod";
import type { TitlesResponse } from "@/types/pb";
import type { FormSubmitEvent } from "#ui/types";

const { pending, create } = useTitleLink();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  title: props.title.id,
  url: undefined,
  source: undefined,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await create(event.data);

  if (res) {
    state.value = {
      title: props.title.id,
      url: undefined,
      source: undefined,
    };
    emit("change");
  }
}
</script>

<template>
  <UForm :schema :state class="space-y-6" @submit="submit">
    <UFormField label="Source" name="source">
      <InputSource v-model="state.source" class="w-full" />
    </UFormField>
    <UFormField label="URL" name="url">
      <UInput v-model="state.url" class="w-full" />
    </UFormField>
    <div class="text-right">
      <UButton type="submit" label="Save" :pending />
    </div>
  </UForm>
</template>
