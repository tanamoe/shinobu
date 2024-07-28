<script setup lang="ts">
import { type ReleasesResponse, type TitlesResponse } from "@/types/pb";
import type { FormSubmitEvent } from "#ui/types";

import { z } from "zod";

const modal = useModal();
const { pending, quickCreate } = usePublication();

const props = defineProps<{
  release: ReleasesResponse<{
    title: TitlesResponse;
  }>;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  from: z.coerce.number().min(0),
  to: z.coerce.number().min(0),
  price: z.coerce.number().min(0).nullable(),
});

type Schema = z.output<typeof schema>;

const state = ref({
  from: undefined,
  to: undefined,
  price: undefined,
});

async function submit(event: FormSubmitEvent<Schema>) {
  await quickCreate(
    props.release,
    props.release.expand!.title,
    event.data.from,
    event.data.to,
    event.data.price || undefined,
  );

  modal.close();
  emit("change");
}
</script>

<template>
  <UModal>
    <UCard>
      <template #header
        >Quick create {{ props.release.expand!.title.name }}</template
      >

      <UForm class="space-y-6" :schema="schema" :state="state" @submit="submit">
        <div class="flex gap-6 items-center">
          <UFormGroup name="from">
            <UInput
              v-model="state.from"
              type="number"
              placeholder="From volume"
            />
          </UFormGroup>
          <UIcon name="i-fluent-arrow-right-20-filled" />
          <UFormGroup name="to">
            <UInput v-model="state.to" type="number" placeholder="To volume" />
          </UFormGroup>
        </div>
        <UFormGroup name="price">
          <UInput v-model="state.price" type="number" placeholder="Price">
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">VND</span>
            </template>
          </UInput>
        </UFormGroup>

        <UButton type="submit" :pending="pending">Create</UButton>
      </UForm>
    </UCard>
  </UModal>
</template>
