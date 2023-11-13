<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { ReleasesStatusOptions, type ReleasesResponse } from "@/types/pb";

const { update, pending } = useRelease();

const props = defineProps<{
  release: ReleasesResponse;
}>();

const emit = defineEmits<{
  change: [void];
}>();

const schema = z.object({
  name: z.string(),
  status: z.nativeEnum(ReleasesStatusOptions),
  publisher: z.string(),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  name: props.release.name,
  status: props.release.status,
  publisher: props.release.publisher,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await update(props.release.id, event.data);
  if (res) emit("change");
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-3" @submit="submit">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <UFormGroup name="name" label="Name">
        <UInput v-model="state.name" />
      </UFormGroup>

      <UFormGroup name="status" label="Status">
        <USelect
          v-model="state.status"
          :options="Object.values(ReleasesStatusOptions)"
        />
      </UFormGroup>

      <UFormGroup name="publisher" label="Publisher">
        <AppPublisherSelect v-model="state.publisher" />
      </UFormGroup>
    </div>

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
  </UForm>
</template>
