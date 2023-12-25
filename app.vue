<script setup lang="ts">
const { update } = useMeta();

await callOnce(update);

useHead({
  bodyAttrs: {
    class: "dark:bg-gray-900 bg-white text-gray-700 dark:text-gray-200",
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />

    <UNotifications />
  </NuxtLayout>
</template>
