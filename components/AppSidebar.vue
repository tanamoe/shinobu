<script setup>
const { $pb } = useNuxtApp();

const name = $pb.authStore.model.email;

const links = [
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
    },
  ],
  [{ label: "Bulk", icon: "i-fluent-library-20-filled", to: "/tools/bulk" }],
];

const items = [[{ label: "Logout", to: "/logout" }]];
</script>

<template>
  <div
    class="w-48 border-r-2 dark:border-zinc-800 border-zinc-100 h-screen p-3 flex flex-col justify-between"
  >
    <div>
      <NuxtLink to="/">
        <img src="/logo.png" class="h-8 mx-auto my-6" />
      </NuxtLink>
      <UVerticalNavigation :links="links" />
    </div>

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
