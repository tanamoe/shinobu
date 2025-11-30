<script setup lang="ts">
import { Collections } from "~/types/pb";

const { $pb } = useNuxtApp();

const page = ref(0);

const { data } = await useAsyncData(() =>
  $pb.collection(Collections.Assets).getList(page.value, 50, {
    sort: "-updated",
  }),
);
</script>

<template>
  <UContainer v-if="data?.items" class="grid grid-cols-5 gap-6">
    <img
      v-for="image of data.items"
      :key="image.id"
      class="rounded-lg"
      :src="$pb.files.getUrl(image, image.image)"
    />
  </UContainer>
</template>
