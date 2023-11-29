<script setup lang="ts">
const { data: gif } = await useFetch("/api/random-gif");
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <img v-if="gif" :src="gif.result" />
  </div>
</template>
