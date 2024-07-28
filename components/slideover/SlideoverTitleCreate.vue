<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const slideover = useSlideover();
const { formats } = useMeta();
const { pending, create } = useTitle();

const emit = defineEmits<{
  change: [];
}>();

const f = computed(() =>
  formats.value.map((format) => ({
    value: format.id,
    label: format.name,
  })),
);

const schema = z.object({
  name: z.string(),
  format: z.string(),
});

type Schema = z.output<typeof schema>;

const state = ref({
  name: undefined,
  format: undefined,
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
        <span class="text-zinc-400">Create a title</span>
      </AppH2>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Format" name="format">
          <USelect v-model="state.format" :options="f" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </UForm>
    </div>
  </USlideover>
</template>
