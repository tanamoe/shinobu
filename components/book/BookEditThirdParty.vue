<script setup lang="ts">
import { parseURL } from "ufo";
import type { ThirdPartySchema } from "~/server/utils/common";

type Provider = "/api/fahasa" | "/api/nxbtre" | "/api/amak";

const url = ref("");
const provider = ref<Provider>("/api/fahasa");

const emit = defineEmits<{
  change: [ThirdPartySchema];
}>();

const { data, status, execute } = await useAsyncData(() =>
  $fetch(provider.value, {
    query: {
      url: encodeURI(url.value),
    },
    immediate: false,
  }),
);

function handleFetch() {
  const parsedURL = parseURL(url.value);

  if (parsedURL.host?.includes("fahasa.com")) {
    provider.value = "/api/fahasa";
  } else if (parsedURL.host?.includes("nxbtre.com")) {
    provider.value = "/api/nxbtre";
  } else if (parsedURL.host?.includes("amakstore.vn")) {
    provider.value = "/api/amak";
  }

  console.log(url.value, provider.value);

  execute();
}

watch([data], () => {
  if (data.value?.data) emit("change", data.value.data);
});
</script>

<template>
  <div class="flex gap-3">
    <UInput v-model="url" class="flex-1" placeholder="URL" />
    <UButton
      icon="i-fluent-sparkle-20-filled"
      color="gray"
      :loading="status === 'pending'"
      @click="handleFetch"
    />
  </div>
</template>
