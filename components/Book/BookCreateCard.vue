<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const { pending, create } = useBook();
const { publication } = usePublications();

const emit = defineEmits<{
  change: [void];
}>();

const schema = z.object({
  publication: z.string(),
  edition: z.string().optional(),
  publishDate: z.string().optional(),
  note: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
});

type Schema = z.output<typeof schema>;

const state = ref<{
  [k: string]: any;
  publication?: string;
}>({
  publication: undefined,
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

watchEffect(() => {
  state.value.publication = publication.value?.id;
});
</script>

<template>
  <UCard>
    <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
      <UFormGroup label="Edition" name="edition">
        <UInput v-model="state.edition" />
      </UFormGroup>
      <UFormGroup label="Publish date" name="publishDate">
        <UInput v-model="state.publishDate" type="date" />
      </UFormGroup>
      <UFormGroup label="Price" name="price">
        <UInput v-model="state.price" type="number">
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs"> VND </span>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup label="Note" name="note">
        <UTextarea v-model="state.note" />
      </UFormGroup>
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
