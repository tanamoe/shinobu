<script setup lang="ts">
import { z } from "zod";
const url = ref("");

const emit = defineEmits<{
  change: [ThirdPartySchema];
}>();

const thirdPartySchema = z.object({
  price: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.replace(/\D/g, "");
    }

    return val;
  }, z.coerce.number().optional()),
  sku: z.string().optional(),
  age: z.string().optional(),
  supplier: z.string().optional(),
  author: z.string().optional(),
  translator: z.string().optional(),
  publisher: z.string().optional(),
  language: z.string().optional(),
  isbn: z.string().optional(),
  weight: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.replace(/\D/g, "");
    }

    return val;
  }, z.coerce.number().optional()),
  size: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const [x, y, z] = val.replace("cm", "").replaceAll(",", ".").split("x");

        return { x, y, z };
      }

      return val;
    },
    z
      .object({
        x: z.coerce.number().optional(),
        y: z.coerce.number().optional(),
        z: z.coerce.number().optional(),
      })
      .optional(),
  ),
  pageCount: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.replace(/\D/g, "");
    }

    return val;
  }, z.coerce.number().optional()),
  printType: z.string().optional(),
  images: z.array(z.string()).optional(),
  note: z.string().optional(),
});

const { data, status, execute } = await useAsyncData(async () => {
  const { product: data } = await $fetch(
    "http://localhost:8080/urano.api.v1beta1.AggregateService/GetFahasaProduct",
    {
      method: "POST",
      body: {
        id: url.value,
      },
    },
  );
  try {
    const a = thirdPartySchema.parse(data);
    console.log(a);
    return a;
  } catch (e) {
    console.log(e);
  }
});

function handleFetch() {
  execute();
}

watch([data], () => {
  if (data.value) emit("change", data.value);
});
</script>

<template>
  <div class="flex gap-3">
    <UInput v-model="url" class="flex-1" placeholder="URL" />
    <UButton
      icon="i-fluent-sparkle-20-filled"
      color="neutral"
      :loading="status === 'pending'"
      @click="handleFetch"
    />
  </div>
</template>
