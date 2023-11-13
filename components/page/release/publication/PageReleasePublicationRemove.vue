<script setup lang="ts">
const { pending, remove } = usePublication();
const { publication, removeOpen } = useReleasePage();

const emit = defineEmits<{
  change: [void];
}>();

async function handleDelete() {
  if (publication.value) {
    const res = await remove(publication.value.id);

    if (res) {
      emit("change");
      removeOpen.value = false;
    }
  }
}
</script>

<template>
  <UModal v-if="publication" v-model="removeOpen">
    <UCard>
      Do you want to delete
      <b>{{ publication.name }}</b
      >?

      <template #footer>
        <div class="space-x-3 justify-end flex">
          <UButton variant="ghost" color="gray" @click="removeOpen = false">
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
