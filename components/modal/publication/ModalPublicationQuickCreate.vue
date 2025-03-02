<script setup lang="ts">
import type { ReleasesResponse } from "@/types/pb";
import type { FormSubmitEvent } from "#ui/types";

import { z } from "zod";

const { pending, quickCreate } = usePublication();

const props = defineProps<{
  release: ReleasesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  from: z.coerce.number().min(0),
  to: z.coerce.number().min(0).optional(),
  price: z.coerce.number().min(0).optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  from: undefined,
  to: undefined,
  price: undefined,
});

async function submit(event: FormSubmitEvent<Schema>) {
  await quickCreate(
    props.release,
    event.data.from,
    event.data.to ?? event.data.from,
    event.data.price || undefined,
  );

  emit("change");
}
</script>

<template>
  <UModal :title="`Quick create ${release.name}`">
    <template #body>
      <UForm class="space-y-6" :schema="schema" :state="state" @submit="submit">
        <div class="flex gap-6 items-center">
          <UFormField name="from">
            <UInput
              v-model="state.from"
              type="number"
              placeholder="From volume"
              class="w-full"
            />
          </UFormField>
          <UIcon name="i-fluent-arrow-right-20-filled" />
          <UFormField name="to">
            <UInput
              v-model="state.to"
              type="number"
              placeholder="To volume"
              class="w-full"
            />
          </UFormField>
        </div>
        <UFormField name="price">
          <UInput
            v-model="state.price"
            type="number"
            placeholder="Price"
            class="w-full"
          >
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">VND</span>
            </template>
          </UInput>
        </UFormField>

        <UButton type="submit" :pending="pending">Create</UButton>
      </UForm>
    </template>
  </UModal>
</template>
