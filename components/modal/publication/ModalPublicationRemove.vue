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
  <UModal v-if="publication">
    <UCard>
      <template #header>Remove Publication</template>

      <p>
        Do you want to remove
        <b>{{ publication.name }}</b>
        ?
      </p>

      <template #footer>
        <div class="space-x-3 justify-end flex">
          <UButton variant="ghost" color="gray" @click="modal.close">
            Cancel
          </UButton>
          <UButton color="red" :pending="pending" @click="handleDelete()">
            Delete
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
