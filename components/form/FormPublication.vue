<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { PublicationsResponse } from "@/types/pb";

interface Props {
  publication?: PublicationsResponse;
}

const { pending, create, update } = usePublication();

const props = defineProps<Props>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  name: z.string().min(1),
  release: z.string().min(1),
  volume: z.coerce.number().optional(),
  description: z.string().optional(),
  subtitle: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  name: props.publication?.name ?? "",
  release: props.publication?.release ?? "",
  volume: props.publication?.volume,
  description: props.publication?.description,
  subtitle: props.publication?.subtitle,
});

async function submit(event: FormSubmitEvent<Schema>) {
  if (props.publication) {
    const res = await update(props.publication.id, event.data);

    if (res) emit("change");
  } else {
    const res = await create(event.data);

    if (res) emit("change");
  }
}
</script>

<template>
  <UForm :schema :state class="space-y-6" @submit="submit">
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UDivider />
    <UFormGroup label="Subtitle" name="subtitle">
      <UInput v-model="state.subtitle" />
    </UFormGroup>
    <UFormGroup label="Volume" name="volume">
      <UInput v-model="state.volume" />
    </UFormGroup>
    <UFormGroup label="Description" name="description">
      <AppEditor v-model="state.description" />
    </UFormGroup>
    <div class="text-right">
      <UButton type="submit" label="Save" :pending="pending" />
    </div>
  </UForm>
</template>
