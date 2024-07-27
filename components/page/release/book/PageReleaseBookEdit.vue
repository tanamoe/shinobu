<script setup lang="ts">
import slug from "slug";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { BooksResponse } from "@/types/pb";

const { pending, update, remove } = useBook();
const { publication } = useReleasePage();

const props = defineProps<{
  book: BooksResponse;
}>();

const emit = defineEmits<{
  change: [void];
}>();

const schema = z.object({
  edition: z.string().optional(),
  publishDate: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  note: z.string().optional(),
  covers: z.array(z.instanceof(File)).optional(),
  "covers-": z.array(z.string()),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  edition: props.book.edition,
  publishDate: props.book.publishDate,
  price: props.book.price,
  note: props.book.note,
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
  const res = await update(props.book.id, event.data);

  if (res) {
    emit("change");
  }
}

async function handleRemove() {
  const res = await remove(props.book.id);

  if (res) {
    emit("change");
  }
}
</script>

<template>
  <UCard>
    <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
      <UFormGroup label="Edition" name="edition">
        <UInput v-model="state.edition" />
      </UFormGroup>
      <UFormGroup label="Publish date" name="publishDate">
        <UInput v-model="state.publishDate" type="date" />
      </UFormGroup>
      <UFormGroup label="Price" name="price">
        <UInput v-model="state.price" type="number">
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs">VND</span>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup label="Note" name="note">
        <UTextarea v-model="state.note" />
      </UFormGroup>
      <UFormGroup label="Covers" name="covers">
        <div class="space-y-3">
          <AppInputFileList
            v-model:remove-files="state['covers-']"
            :record="book"
            :files="book.covers"
          />
          <input class="mt-3" type="file" multiple @change="fileChange" />
        </div>
      </UFormGroup>
      <div class="text-right space-x-3">
        <UButton
          label="Delete"
          :pending="pending"
          variant="ghost"
          color="red"
          @click="handleRemove"
        />
        <UButton label="Save" :pending="pending" type="submit" />
      </div>
    </UForm>
  </UCard>
</template>
