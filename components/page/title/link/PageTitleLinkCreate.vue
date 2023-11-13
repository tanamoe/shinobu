<script setup lang="ts">
import { z } from "zod";
import { Collections, type TitlesResponse } from "@/types/pb";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const { $pb } = useNuxtApp();
const { pending, create } = useTitleLink();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [void];
}>();

const { data: sources } = await useLazyAsyncData(
  () =>
    $pb.collection(Collections.LinkSources).getList(1, 15, {
      fields: "id,collectionId,name,icon",
      sort: "-updated",
    }),
  {
    transform: (data) =>
      data.items.map((source) => ({
        id: source.id,
        label: source.name,
        avatar: {
          src: $pb.files.getUrl(source, source.icon, { thumb: "50x50" }),
        },
      })),
  },
);

const schema = z.object({
  title: z.string(),
  url: z.string().url(),
  source: z.string(),
});

type Schema = z.output<typeof schema>;

const isOpen = ref(false);

const state = ref<Partial<Schema>>({
  title: props.title.id,
  url: undefined,
  source: undefined,
});

const current = computed(
  () => sources.value?.find((source) => source.id === state.value.source),
);

async function search(query: string) {
  const res = await $pb.collection(Collections.LinkSources).getList(1, 15, {
    filter: `name~'${query}'`,
    fields: "id,collectionId,name,icon",
    sort: "-updated",
  });

  return res.items.map((source) => ({
    id: source.id,
    label: source.name,
    avatar: {
      src: $pb.files.getUrl(source, source.icon, { thumb: "50x50" }),
    },
  }));
}

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await create(event.data);

  if (res) {
    isOpen.value = false;
    state.value = {
      title: props.title.id,
      url: undefined,
      source: undefined,
    };
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
        <span class="text-zinc-400">Attach a source for</span>
        {{ title.name }}
      </AppH2>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormGroup label="Source" name="source">
          <USelectMenu
            v-if="sources"
            v-model="state.source"
            :options="sources"
            value-attribute="id"
            option-attribute="label"
            :searchable="search"
          >
            <template #label>
              <span v-if="current" class="truncate flex gap-1.5 items-center">
                <img :src="current.avatar.src" class="h-4 w-auto" />
                <span>{{ current?.label }}</span>
              </span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup label="URL" name="url">
          <UInput v-model="state.url" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </UForm>
    </div>
  </USlideover>
</template>
