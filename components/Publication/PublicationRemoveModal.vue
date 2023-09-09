<script setup lang="ts">
import { PublicationResponse } from "@/types/pb";

const { pending, remove } = usePublication();

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
  await remove(props.publication.id);
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
          <UButton color="red" :pending="pending" @click="handleDelete()">
            Delete
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
