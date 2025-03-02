<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { TitlesResponse } from "@/types/pb";

const { languages } = useMeta();
const { pending, create } = useAdditionalTitleName();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  title: z.string(),
  language: z.string(),
  name: z.string().min(1).trim(),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  title: props.title.id,
  language: undefined,
  name: undefined,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const response = await create(event.data);

  if (response) {
    emit("change");
  }
}
</script>

<template>
  <UForm :schema :state class="space-y-6" @submit="submit">
    <UFormField label="Language" name="language">
      <USelectMenu
        v-model="state.language"
        value-key="id"
        option-key="label"
        :items="languages"
        class="w-full"
      />
    </UFormField>
    <UFormField label="Name" name="name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>
    <div class="text-right">
      <UButton type="submit" label="Save" :pending />
    </div>
  </UForm>
</template>
