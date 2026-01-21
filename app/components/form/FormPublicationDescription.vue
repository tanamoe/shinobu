<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import type { PublicationsResponse } from "@/types/pb";
import { ModalProductAggregate } from "#components";

const { $urano } = useNuxtApp();
const { update } = usePublication();

const overlay = useOverlay();

const modal = overlay.create(ModalProductAggregate);

const edit = ref(false);

const props = defineProps<{
  publication: Pick<PublicationsResponse, "id" | "description">;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  description: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  description: props.publication.description,
});

async function open() {
  const instance = modal.open();

  const id = await instance.result;

  const data = await $urano.getFahasaProduct({ id: BigInt(id) });

  if (data.product) {
    state.value.description = data.product.description;
  }
}

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await update(props.publication.id, event.data);
  if (res) emit("change");
  edit.value = false;
}
</script>

<template>
  <UForm :schema :state class="space-y-3" @submit="submit">
    <UButton @click="open">Auto-fill from third-party</UButton>
    <UFormField name="description" label="Description">
      <UEditor
        v-model="state.description"
        class="text-highlighted bg-default ring ring-inset ring-accented rounded-md"
        :ui="{ base: 'py-2 px-3 sm:px-3' }"
      />
    </UFormField>

    <UButton
      icon="i-fluent-checkmark-20-filled"
      variant="soft"
      color="primary"
      type="submit"
    >
      Save
    </UButton>
  </UForm>
</template>
