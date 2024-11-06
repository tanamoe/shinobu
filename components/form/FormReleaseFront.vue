<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { AssetsResponse, ReleasesResponse } from "@/types/pb";
import type { MetadataImages } from "@/types/common";
import { ModalAssetSelect } from "#components";

const { open } = useModal();
const { update, pending } = useRelease();

const props = defineProps<{
  release: ReleasesResponse;
  front?: AssetsResponse<MetadataImages>;
}>();

const emit = defineEmits<{
  change: [];
}>();

const front = ref(props.front);

const schema = z.object({
  front: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  front: props.release.front,
});

function clear() {
  front.value = undefined;
  state.value.front = "";
}

function change() {
  open(ModalAssetSelect, {
    release: props.release.id,
    onSelect(asset) {
      front.value = asset;
      state.value.front = asset.id;
    },
  });
}

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await update(props.release.id, event.data);
  if (res) emit("change");
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-3" @submit="submit">
    <UFormGroup name="front" label="Front" class="hidden">
      <UInput v-model="state.front" />
    </UFormGroup>

    <AppImageCover
      class="max-w-sm rounded hover:brightness-75 transition hover:cursor-pointer"
      :name="release.name"
      :src="front && $pb.files.getUrl(front, front.image)"
      :srcset="front && front.resizedImage"
      aspect="full"
      @click="change"
    />

    <div class="flex gap-3">
      <UButton
        v-if="state.front"
        class="flex-1"
        color="red"
        variant="ghost"
        block
        @click="clear"
      >
        Clear
      </UButton>
      <UButton
        class="flex-1"
        color="gray"
        icon="i-fluent-save-20-filled"
        :loading="pending"
        type="submit"
        block
      >
        Save
      </UButton>
    </div>
  </UForm>
</template>
