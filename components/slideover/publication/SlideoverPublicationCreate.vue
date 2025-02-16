<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { ReleasesResponse } from "@/types/pb";

const slideover = useSlideover();
const { pending, create } = usePublication();

const props = defineProps<{
  release: Pick<ReleasesResponse, "name" | "id">;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  release: z.string(),
  name: z.string(),
  volume: z.coerce.number(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  release: props.release.id,
  name: undefined,
  volume: undefined,
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
  <USlideover :title="`Create a publication for ${release.name}`">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Volume" name="volume">
          <UInput v-model="state.volume" />
        </UFormField>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </UForm>
    </template>
  </USlideover>
</template>
