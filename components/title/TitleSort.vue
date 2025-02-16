<script setup lang="ts">
const items = ref([
  { label: "Latest", value: "-updated" },
  { label: "Oldest", value: "+updated" },
]);
const value = defineModel<string>({ default: "-updated" });
</script>

<template>
  <USelect v-model="value" :items="items" class="w-48" />
</template>
