<script setup lang="ts">
import { z } from "zod";
import { ReleasesStatusOptions, type TitlesResponse } from "@/types/pb";
import type { FormSubmitEvent } from "#ui/types";

const slideover = useSlideover();
const { pending, create } = useRelease();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  title: z.string(),
  name: z.string().min(1),
  type: z.string().min(1),
  disambiguation: z.string().optional(),
  publisher: z.string().min(1),
  partner: z.string(),
  status: z.nativeEnum(ReleasesStatusOptions),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  title: props.title.id,
  name: "",
  type: "",
  disambiguation: "",
  publisher: "",
  partner: "",
  status: ReleasesStatusOptions.ON_GOING,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await create(event.data);

  if (res) {
    slideover.close();
    emit("change");
  }
}
</script>

<template>
  <USlideover>
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Create a release for</span>
        {{ title.name }}
      </AppH2>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Type" name="type">
          <UInput v-model="state.type" />
        </UFormGroup>
        <UFormGroup label="Disambiguation" name="disambiguation">
          <UInput v-model="state.disambiguation" />
        </UFormGroup>
        <UFormGroup label="Publisher" name="publisher">
          <InputPublisher v-model="state.publisher" />
        </UFormGroup>
        <UFormGroup label="Partner" name="partner">
          <InputPublisher v-model="state.partner" />
        </UFormGroup>
        <UFormGroup label="Status" name="status">
          <USelect
            v-model="state.status"
            :options="Object.values(ReleasesStatusOptions)"
          />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </UForm>
    </div>
  </USlideover>
</template>
