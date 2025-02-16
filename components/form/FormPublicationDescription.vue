<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import type { PublicationsResponse } from "@/types/pb";

const { update } = usePublication();

const edit = ref(false);

const props = defineProps<{
  publication: Pick<PublicationsResponse, "id" | "description">;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  description: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  description: props.publication.description,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await update(props.publication.id, event.data);
  if (res) emit("change");
  edit.value = false;
}
</script>

<template>
  <UForm :schema :state class="space-y-3" @submit="submit">
    <UFormField name="description" label="Description">
      <AppEditor v-model="state.description" />
    </UFormField>

    <UButton
      icon="i-fluent-checkmark-20-filled"
      variant="soft"
      color="primary"
      type="submit"
    >
      Save
    </UButton>
  </UForm>
</template>
