<script setup lang="ts">
import type { PublicationsResponse } from "@/types/pb";

const modal = useModal();
const { pending, remove } = usePublication();

const props = defineProps<{
  publication: PublicationsResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

async function handleDelete() {
  const res = await remove(props.publication.id);

  if (res) {
    emit("change");
    modal.close();
  }
}
</script>

<template>
  <UModal title="Remove publication">
    <template #body>
      <p>
        Do you want to remove
        <b>{{ publication.name }}</b>
        ?
      </p>
    </template>

    <template #footer>
      <div class="space-x-3 justify-end flex">
        <UButton variant="ghost" color="neutral" @click="modal.close">
          Cancel
        </UButton>
        <UButton color="warning" :pending="pending" @click="handleDelete()">
          Delete
        </UButton>
      </div>
    </template>
  </UModal>
</template>
