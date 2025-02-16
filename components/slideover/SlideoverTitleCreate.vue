<script setup lang="ts">
const { close } = useSlideover();

const emit = defineEmits<{
  change: [];
}>();

function change() {
  emit("change");
  close();
}
</script>

<template>
  <USlideover title="Create a title">
    <template #body>
      <FormTitleCreate @change="change" />
    </template>
  </USlideover>
</template>
