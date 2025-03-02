<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import type { PublicationsResponse } from "@/types/pb";

const { update, pending } = usePublication();

const edit = ref(false);

const props = defineProps<{
  publication: Pick<PublicationsResponse, "id" | "name" | "subtitle">;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  name: z.string(),
  subtitle: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  name: props.publication.name,
  subtitle: props.publication.subtitle,
});

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await update(props.publication.id, event.data);
  if (res) emit("change");
  edit.value = false;
}
</script>

<template>
  <div v-if="!edit" class="flex items-center gap-2">
    {{ props.publication.name }}
    <span v-if="props.publication.subtitle">
      ({{ props.publication.subtitle }})
    </span>
    <UButton
      icon="i-fluent-edit-20-filled"
      square
      variant="ghost"
      color="neutral"
      size="xs"
      @click="
        () => {
          edit = true;
        }
      "
    />
  </div>

  <UForm v-else :schema :state class="flex items-center gap-2" @submit="submit">
    <UInput v-model="state.name" size="sm" />
    <UInput v-model="state.subtitle" size="sm" />
    <UButton
      icon="i-fluent-checkmark-20-filled"
      square
      variant="ghost"
      color="neutral"
      size="sm"
      type="submit"
    />
    <UButton
      icon="i-fluent-dismiss-20-filled"
      square
      color="error"
      variant="ghost"
      size="sm"
      :loading="pending"
      @click="
        () => {
          edit = false;
        }
      "
    />
  </UForm>
</template>
