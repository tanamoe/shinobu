<script setup>
const { $pb } = useNuxtApp();

const name = $pb.authStore.model.email;

const links = [
  {
    label: "Trang chủ",
    icon: "i-fluent-home-20-filled",
    to: "/",
  },
  {
    label: "Tựa truyện",
    icon: "i-fluent-book-20-filled",
    to: "/title",
  },
];

const items = [
  [
    {
      label: "Đăng xuất",
      to: "/logout",
    },
  ],
];
</script>

<template>
  <div
    class="w-48 border-r-2 dark:border-zinc-800 border-zinc-100 h-screen p-3 flex flex-col justify-between"
  >
    <UVerticalNavigation :links="links" />

    <UDropdown :items="items" :popper="{ placement: 'top-start' }">
      <UButton
        truncate
        class="w-full"
        color="gray"
        :label="name"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      />
    </UDropdown>
  </div>
</template>
