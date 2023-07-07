<script setup lang="ts">
const { $pb } = useNuxtApp();
const route = useRoute();

const title = await $pb
  .collection("title")
  .getOne(route.params.titleId as string);

console.log(title);
</script>

<template>
  <div class="p-6">
    <AppHeader>{{ title.name }}</AppHeader>
  </div>
</template>
