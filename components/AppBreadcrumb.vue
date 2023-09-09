<script setup lang="ts">
type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <AppH1>
    <ol class="flex gap-3 items-center">
      <li
        v-for="item in items"
        :key="item.label"
        class="flex items-center gap-3"
        :class="{
          'text-zinc-400': !item.active,
        }"
      >
        <NuxtLink
          v-if="item.href"
          class="hover:underline"
          :to="item.href"
          color="gray"
          variant="link"
        >
          {{ item.label }}
        </NuxtLink>
        <span v-else>{{ item.label }}</span>
        <span>/</span>
      </li>
    </ol>
  </AppH1>
</template>
