<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { TitlesResponse } from "@/types/pb";

const modal = useModal();
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
  language: "",
  name: "",
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await create(event.data);

  if (res) {
    emit("change");
    modal.close();
  }
}
</script>

<template>
  <UModal>
    <UCard>
      <template #header>Additional Names</template>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormGroup label="Language" name="language">
          <USelectMenu
            v-model="state.language"
            value-attribute="id"
            option-attribute="label"
            :options="languages"
          />
        </UFormGroup>
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
