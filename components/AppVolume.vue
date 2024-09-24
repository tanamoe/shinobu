<script setup lang="ts">
const { volume } = defineProps<{ volume: number }>();
</script>

<template>
  <UBadge color="gray">
    <span v-if="volume == 0">Oneshot</span>
    <span v-else-if="volume >= 90000000">Boxset</span>
    <span v-else>
      {{ Math.floor(volume / 10000) + (volume % 10) * 0.1 }}
    </span>
  </UBadge>
</template>
