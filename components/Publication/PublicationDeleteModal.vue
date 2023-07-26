<script setup lang="ts">
import { PublicationResponse } from "@/types/pb";

const { isLoading, execute: deletePublication } = useDeletePublication();

const props = defineProps<{
  modelValue: boolean;
  publication: PublicationResponse;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleDelete = async () => {
  await deletePublication(0, props.publication.id);
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <UModal v-model="isOpen">
    <UCard>
      Do you want to delete
      <b>{{ publication.name }}</b
      >?

      <template #footer>
        <div class="space-x-3 justify-end flex">
          <UButton variant="ghost" color="gray" @click="isOpen = !isOpen">
            Cancel
          </UButton>
          <UButton color="red" :pending="isLoading" @click="handleDelete()">
            Delete
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
