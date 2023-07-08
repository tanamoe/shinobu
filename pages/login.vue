<script setup lang="ts">
import { Admin } from "pocketbase";

const { $pb } = useNuxtApp();
const toast = useToast();

const email = ref("");
const password = ref("");
const pending = ref(false);

const login = async () => {
  pending.value = true;

  try {
    await $pb.admins.authWithPassword(email.value, password.value);

    pending.value = false;

    toast.add({
      id: "login_success",
      title: `Successfully login as ${email.value}!`,
      description: "Redirecting...",
      icon: "i-fluent-checkmark-circle-20-filled",
      color: "sky",
    });

    return navigateTo("/");
  } catch (err) {
    pending.value = false;

    toast.add({
      id: "login_error",
      title: "An error occurred.",
      icon: "i-fluent-error-circle-20-filled",
      color: "red",
    });

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
          <UButton type="submit" :loading="pending">Đăng nhập</UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>
