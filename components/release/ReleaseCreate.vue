<script setup lang="ts">
import { z } from "zod";
import { ReleasesStatusOptions, type TitlesResponse } from "@/types/pb";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const { pending, create } = useRelease();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [void];
}>();

const schema = z.object({
  title: z.string(),
  name: z.string(),
  publisher: z.string(),
  status: z.nativeEnum(ReleasesStatusOptions),
});

type Schema = z.output<typeof schema>;

const isOpen = ref(false);

const state = ref({
  title: props.title.id,
  name: undefined,
  publisher: "",
  status: undefined,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await create(event.data);

  if (res) {
    emit("change");
    isOpen.value = false;
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
        <span class="text-zinc-400">Create a release for</span>
        {{ title.name }}
      </AppH2>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Publisher" name="publisher">
          <AppPublisherSelect v-model="state.publisher" />
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
