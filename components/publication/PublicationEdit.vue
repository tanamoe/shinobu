<script setup lang="ts">
import slug from "slug";
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const { pending, update } = usePublication();
const { publication, editOpen } = usePublications();

const emit = defineEmits<{
  change: [void];
}>();

const schema = z.object({
  name: z.string(),
  volume: z.number(),
  digital: z.boolean(),
  covers: z.array(z.instanceof(File)).optional(),
  "covers-": z.array(z.string()),
});

type Schema = z.output<typeof schema>;

const state = ref<{
  [k: string]: any;
  covers: File[] | undefined;
}>({
  name: undefined,
  volume: undefined,
  digital: false,
  covers: undefined,
  "covers-": [],
});

function fileChange(e: Event) {
  const files = (e.target as HTMLInputElement | null)?.files;
  const covers = [];

  if (files) {
    for (const f of files) {
      const file = new File(
        [f],
        slug(publication.value?.name || "") + "." + f.name.split(".").at(-1),
        {
          type: f.type,
        },
      );

      covers.push(file);
    }
  }

  state.value.covers = covers;
}

async function submit(event: FormSubmitEvent<Schema>) {
  if (publication.value) {
    const res = await update(publication.value.id, event.data);

    if (res) {
      emit("change");
      editOpen.value = false;
    }
  }
}

watchEffect(() => {
  state.value = {
    name: publication.value?.name,
    volume: publication.value?.volume,
    digital: publication.value?.digital,
    covers: undefined,
    "covers-": [],
  };
});
</script>

<template>
  <USlideover v-if="publication" v-model="editOpen">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Update</span>
        {{ publication.name }}
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
        <UFormGroup label="Cover" name="covers">
          <AppInputFileList
            v-model:remove-files="state['covers-']"
            :record="publication"
            :files="publication.covers"
          />
          <input class="mt-3" type="file" multiple @change="fileChange" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </UForm>
    </div>
  </USlideover>
</template>
