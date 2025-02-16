<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { PublicationsResponse } from "@/types/pb";

const { pending, create } = useBook();

const props = defineProps<{
  publication: PublicationsResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  publication: z.string(),
  edition: z.string().optional(),
  publishDate: z.string().optional(),
  note: z.string().optional(),
  price: z.coerce.number().optional(),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  publication: props.publication.id,
  edition: undefined,
  publishDate: undefined,
  note: undefined,
  price: undefined,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await create(event.data);

  if (res) {
    emit("change");
  }
}
</script>

<template>
  <UCard>
    <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
      <UFormField label="Edition" name="edition">
        <UInput v-model="state.edition" />
      </UFormField>
      <UFormField label="Publish date" name="publishDate">
        <UInput v-model="state.publishDate" type="date" />
      </UFormField>
      <UFormField label="Price" name="price">
        <UInput v-model="state.price" type="number">
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs"> VND </span>
          </template>
        </UInput>
      </UFormField>
      <UFormField label="Note" name="note">
        <UTextarea v-model="state.note" />
      </UFormField>
      <div class="text-right space-x-3">
        <UButton
          label="Create"
          icon="i-fluent-add-20-filled"
          type="submit"
          :pending="pending"
        />
      </div>
    </UForm>
  </UCard>
</template>
