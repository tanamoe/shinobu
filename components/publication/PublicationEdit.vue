<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { PublicationsResponse } from "@/types/pb";

const { pending, update } = usePublication();

const props = defineProps<{
  publication: PublicationsResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  name: z.string(),
  volume: z.coerce.number().min(0),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  name: props.publication.name,
  volume: props.publication.volume,
});

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  const res = await update(props.publication.id, event.data);

  if (res) {
    emit("change");
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-6"
    @submit="handleSubmit"
  >
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup label="Volume" name="volume">
      <UInput v-model="state.volume" />
    </UFormGroup>
    <div class="text-right">
      <UButton type="submit" label="Save" :pending="pending" />
    </div>
  </UForm>
</template>
