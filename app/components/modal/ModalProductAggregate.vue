<script setup lang="ts">
const { $urano } = useNuxtApp();

const emit = defineEmits<{
  close: [string];
}>();

const page = ref(0);

const { data } = await useAsyncData(
  () =>
    $urano.listFahasaProduct({
      categoryId: 6718n,
      pageSize: 20,
      skip: page.value + 1,
    }),
  { server: false, lazy: true, watch: [page] },
);
</script>

<template>
  <UModal title="Assets">
    <template #body>
      <div v-if="data?.products" class="grid grid-cols-6 gap-3">
        <div
          v-for="product in data.products"
          :key="product.id"
          class="rounded w-full object-contain aspect-square bg-gray-200 dark:bg-gray-800 hover:brightness-75 transition-all hover:cursor-pointer"
          @click="emit('close', product.id)"
        >
          <img :src="product.images[0]" />
          {{ product.name }}
        </div>
      </div>

      <UButton
        v-if="page != 0"
        @click="
          () => {
            page -= 1;
          }
        "
        >Previous</UButton
      >
      <UButton
        @click="
          () => {
            page += 1;
          }
        "
        >Next</UButton
      >
    </template>
  </UModal>
</template>
