<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
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
  disambiguation: z.string(),
  status: z.nativeEnum(ReleasesStatusOptions),
  publisher: z.string(),
  partner: z.string(),
  digital: z.boolean(),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  name: props.release.name,
  disambiguation: props.release.disambiguation,
  status: props.release.status,
  publisher: props.release.publisher,
  partner: props.release.partner,
  digital: props.release.digital,
});

function clearPartner() {
  state.value.partner = "";
}

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await update(props.release.id, event.data);
  if (res) emit("change");
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-3" @submit="submit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <UFormGroup name="name" label="Name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UFormGroup name="disambiguation" label="Disambiguation">
        <UInput v-model="state.disambiguation" />
      </UFormGroup>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <UFormGroup name="status" label="Status">
        <USelect
          v-model="state.status"
          :options="Object.values(ReleasesStatusOptions)"
        />
      </UFormGroup>
      <UFormGroup name="publisher" label="Publisher">
        <AppPublisherSelect v-model="state.publisher" />
      </UFormGroup>
      <UFormGroup name="partner" label="Partner">
        <div class="flex gap-3">
          <AppPublisherSelect v-model="state.partner" class="flex-1" />
          <UButton
            v-if="state.partner != ''"
            label="Clear"
            @click="clearPartner"
          />
        </div>
      </UFormGroup>
    </div>

    <UFormGroup name="digital" label="Digital">
      <UToggle v-model="state.digital" />
    </UFormGroup>

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
