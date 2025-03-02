<script setup lang="ts">
const emit = defineEmits<{
  change: [];
}>();

function change() {
  emit("change");
}
</script>

<template>
  <USlideover title="Create a title">
    <template #body>
      <FormTitleCreate @change="change" />
    </template>
  </USlideover>
</template>
