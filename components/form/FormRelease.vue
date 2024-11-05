<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import {
  ReleasesStatusOptions,
  type AssetsResponse,
  type ReleasesResponse,
} from "@/types/pb";
import type { MetadataImages } from "~/types/common";
import ModalAssetSelect from "../modal/ModalAssetSelect.vue";

const { open } = useModal();
const { update, pending } = useRelease();

const props = defineProps<{
  release: ReleasesResponse<{
    logo: AssetsResponse<MetadataImages>;
    front: AssetsResponse<MetadataImages>;
    banner: AssetsResponse<MetadataImages>;
  }>;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  disambiguation: z.string(),
  status: z.nativeEnum(ReleasesStatusOptions),
  publisher: z.string(),
  partner: z.string(),
  digital: z.boolean(),
  front: z.string().optional(),
  logo: z.string().optional(),
  banner: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = ref<Schema>({
  name: props.release.name,
  type: props.release.type,
  disambiguation: props.release.disambiguation,
  status: props.release.status,
  publisher: props.release.publisher,
  partner: props.release.partner,
  digital: props.release.digital,
  front: props.release.front,
  logo: props.release.logo,
  banner: props.release.banner,
});

const front = ref(props.release.expand?.front);

function clearPartner() {
  state.value.partner = "";
}

function changeFront() {
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
  <UForm
    :schema="schema"
    :state="state"
    class="flex gap-6 w-full"
    @submit="submit"
  >
    <div class="space-y-3 flex-1">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <UFormGroup name="name" label="Name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup name="type" label="Type">
          <UInput v-model="state.type" />
        </UFormGroup>
        <UFormGroup name="disambiguation" label="Disambiguation">
          <UInput v-model="state.disambiguation" />
        </UFormGroup>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <UFormGroup name="status" label="Status">
          <USelect
            v-model="state.status"
            :options="Object.values(ReleasesStatusOptions)"
          />
        </UFormGroup>
        <UFormGroup name="publisher" label="Publisher">
          <InputPublisher v-model="state.publisher" />
        </UFormGroup>
        <UFormGroup name="partner" label="Partner">
          <div class="flex gap-3">
            <InputPublisher v-model="state.partner" class="flex-1" />
            <UButton
              v-if="state.partner != ''"
              label="Clear"
              @click="clearPartner"
            />
          </div>
        </UFormGroup>
      </div>

      <UFormGroup name="digital" label="Digital">
        <UToggle v-model="state.digital" />
      </UFormGroup>

      <div class="text-right">
        <UButton
          color="gray"
          icon="i-fluent-save-20-filled"
          :loading="pending"
          type="submit"
        >
          Save
        </UButton>
      </div>
    </div>
    <AppImageCover
      class="max-w-sm rounded hover:brightness-75 transition hover:cursor-pointer"
      :name="release.name"
      :src="front && $pb.files.getUrl(front, front.image)"
      :srcset="front && front.resizedImage"
      aspect="full"
      @click="changeFront"
    />
  </UForm>
</template>
