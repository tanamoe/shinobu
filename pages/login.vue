<script setup lang="ts">
import { Admin } from "pocketbase";

const { $pb } = useNuxtApp();

const email = ref("");
const password = ref("");

const login = async () => {
  try {
    await $pb.admins.authWithPassword(email.value, password.value);

    return navigateTo("/");
  } catch (err) {
    console.log(err);
  }
};

definePageMeta({
  layout: false,
  middleware: () => {
    const { $pb } = useNuxtApp();

    if ($pb.authStore.model instanceof Admin) return navigateTo("/");
  },
});
</script>

<template>
  <div class="max-w-sm w-full mx-auto my-24">
    <img class="h-12 w-auto mx-auto mb-12" src="/logo.png" />
    <UCard class="mx-6">
      <form class="space-y-3" @submit.prevent="login">
        <UFormGroup name="email" label="Email">
          <UInput
            v-model="email"
            placeholder="admin@tana.moe"
            icon="i-fluent-mail-16-filled"
          />
        </UFormGroup>
        <UFormGroup name="password" label="Password">
          <UInput
            v-model="password"
            placeholder="•••••••••••••••"
            icon="i-fluent-key-16-filled"
            type="password"
          />
        </UFormGroup>
        <div class="text-right">
          <UButton @click="login">Đăng nhập</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
