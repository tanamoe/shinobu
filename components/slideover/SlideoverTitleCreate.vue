<script setup lang="ts">
defineEmits<{
  close: [boolean];
}>();
</script>

<template>
  <USlideover title="Create a title">
    <template #body>
      <FormTitleCreate @change="$emit('close', true)" />
    </template>
  </USlideover>
</template>
