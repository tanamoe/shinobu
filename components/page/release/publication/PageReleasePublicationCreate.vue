<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { type ReleasesResponse } from "@/types/pb";

const { pending, create } = usePublication();

const props = defineProps<{
  release: Pick<ReleasesResponse, "name" | "id">;
}>();

const emit = defineEmits<{
  change: [void];
}>();

const schema = z.object({
  release: z.string(),
  name: z.string(),
  volume: z.coerce.number(),
  digital: z.boolean(),
});

type Schema = z.output<typeof schema>;

const isOpen = ref(false);

const state = ref({
  release: props.release.id,
  name: undefined,
  volume: undefined,
  digital: false,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await create(event.data);
  if (res) {
    isOpen.value = false;
    emit("change");
  }
}
</script>

<template>
  <UButton
    color="gray"
    icon="i-fluent-add-square-multiple-20-filled"
    class="float-right"
    @click="isOpen = true"
  >
    Create
  </UButton>
  <USlideover v-model="isOpen">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Create a publication for</span>
        {{ release.name }}
      </AppH2>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Volume" name="volume">
          <UInput v-model="state.volume" />
        </UFormGroup>
        <UFormGroup label="Digital" name="digital">
          <UToggle v-model="state.digital" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </UForm>
    </div>
  </USlideover>
</template>
