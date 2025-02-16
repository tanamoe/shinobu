<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import {
  ReleasesStatusOptions,
  type ReleasesResponse,
  type TitlesResponse,
} from "@/types/pb";

const { create, update, pending } = useRelease();

const props = defineProps<{
  title?: TitlesResponse;
  release?: ReleasesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  disambiguation: z.string().optional(),
  status: z.nativeEnum(ReleasesStatusOptions),
  publisher: z.string(),
  partner: z.string().optional(),
  digital: z.boolean().default(false),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  name: props.release?.name,
  type: props.release?.type,
  disambiguation: props.release?.disambiguation,
  status: props.release?.status,
  publisher: props.release?.publisher,
  partner: props.release?.partner,
  digital: props.release?.digital,
});

function clearPartner() {
  state.value.partner = "";
}

async function submit(event: FormSubmitEvent<Schema>) {
  if (props.release?.id) {
    const res = await update(props.release.id, event.data);
    if (res) emit("change");
  } else if (props.title?.id) {
    const res = await create({
      title: props.title.id,
      ...event.data,
    });
    if (res) emit("change");
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-3" @submit="submit">
    <UFormField name="name" label="Name" required>
      <UInput v-model="state.name" class="w-full" />
    </UFormField>
    <UFormField name="type" label="Type" required>
      <UInput v-model="state.type" class="w-full" />
    </UFormField>
    <UFormField name="disambiguation" label="Disambiguation">
      <UInput v-model="state.disambiguation" class="w-full" />
    </UFormField>
    <UFormField name="status" label="Status" required>
      <USelect
        v-model="state.status"
        :options="Object.values(ReleasesStatusOptions)"
        class="w-full"
      />
    </UFormField>
    <UFormField name="publisher" label="Publisher" required>
      <InputPublisher v-model="state.publisher" class="w-full" />
    </UFormField>
    <UFormField name="partner" label="Partner">
      <div class="flex gap-3">
        <InputPublisher v-model="state.partner" class="flex-1 w-full" />
        <UButton
          v-if="state.partner != ''"
          label="Clear"
          @click="clearPartner"
        />
      </div>
    </UFormField>

    <UFormField name="digital">
      <UCheckbox v-model="state.digital" required label="Digital" />
    </UFormField>

    <div class="text-right">
      <UButton
        color="primary"
        icon="i-fluent-save-20-filled"
        :loading="pending"
        type="submit"
      >
        Save
      </UButton>
    </div>
  </UForm>
</template>
