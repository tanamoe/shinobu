<script setup lang="ts">
import { UNavigationMenu } from "#components";

const route = useRoute();

const items = computed(() => [
  [
    {
      label: "Home",
      icon: "i-fluent-home-20-filled",
      to: "/",
    },
    {
      label: "Title",
      icon: "i-fluent-book-20-filled",
      to: "/title",
      active: route.path.includes("/title"),
    },
  ],
  [
    {
      label: "Tools",
      icon: "i-fluent-wrench-20-filled",
      children: [
        {
          label: "Bulk",
          icon: "i-fluent-library-20-filled",
          to: "/tools/bulk",
        },
      ],
    },
  ],
]);
</script>

<template>
  <div
    class="w-48 border-r-2 dark:border-zinc-800 border-zinc-100 h-screen p-3 flex flex-col justify-between"
  >
    <div>
      <NuxtLink to="/">
        <img src="/logo.png" class="h-8 mx-auto my-6" />
      </NuxtLink>
      <UNavigationMenu orientation="vertical" :items />
    </div>
  </div>
</template>
