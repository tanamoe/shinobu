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

const state = reactive<Partial<Schema>>({
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
  <USlideover title="Create a title">
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Format" name="format">
          <USelect v-model="state.format" :options="f" />
        </UFormField>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </UForm>
    </template>
  </USlideover>
</template>
