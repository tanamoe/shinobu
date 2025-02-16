<script setup lang="ts">
const { update } = useMeta();

await callOnce(update);
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#89C4F4" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
