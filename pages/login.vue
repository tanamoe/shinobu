<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const { $pb } = useNuxtApp();
const toast = useToast();

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Invalid password"),
});

type Schema = z.output<typeof schema>;

const state = ref({
  email: undefined,
  password: undefined,
});
const pending = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  pending.value = true;

  try {
    await $pb.admins.authWithPassword(event.data.email, event.data.password);

    toast.add({
      id: "login_success",
      title: `Successfully login as ${event.data.email}!`,
      description: "Redirecting...",
      icon: "i-fluent-checkmark-circle-20-filled",
      color: "sky",
    });

    return navigateTo("/");
  } catch (err) {
    toast.add({
      id: "login_error",
      title: "An error occurred.",
      icon: "i-fluent-error-circle-20-filled",
      color: "red",
    });

    console.error(err);
  } finally {
    pending.value = false;
  }
}

definePageMeta({
  layout: false,
  middleware: "login",
});
</script>

<template>
  <div class="max-w-sm w-full mx-auto my-24">
    <img class="h-12 w-auto mx-auto mb-12" src="/logo.png" />
    <UCard class="mx-6" :ui="{ body: { padding: 'p-6 sm:p-6' } }">
      <UForm
        :state="state"
        :schema="schema"
        class="space-y-3"
        @submit="onSubmit"
      >
        <UFormGroup name="email" label="Email">
          <UInput
            v-model="state.email"
            placeholder="admin@tana.moe"
            icon="i-fluent-mail-16-filled"
          />
        </UFormGroup>
        <UFormGroup name="password" label="Password">
          <UInput
            v-model="state.password"
            placeholder="•••••••••••••••"
            icon="i-fluent-key-16-filled"
            type="password"
          />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" :loading="pending">Đăng nhập</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
