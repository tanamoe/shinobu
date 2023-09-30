<script setup lang="ts">
import { type ReleaseResponse, type TitleResponse } from "@/types/pb";

const { pending, quickCreate } = usePublication();

const props = defineProps<{
  modelValue: boolean;
  release: ReleaseResponse;
  title: TitleResponse;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const state = ref({
  from: undefined,
  to: undefined,
  price: undefined,
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function handleCreate() {
  if (state.value.from && state.value.to && state.value.price) {
    quickCreate(
      props.release,
      props.title,
      state.value.from,
      state.value.to,
      state.value.price,
    );
  }
}
</script>

<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>Quick create {{ title.name }}</template>

      <form class="space-y-6" @submit.prevent="handleCreate()">
        <div class="flex gap-6 items-center">
          <UFormGroup name="from">
            <UInput v-model="state.from" placeholder="From volume" />
          </UFormGroup>
          <UIcon name="i-fluent-arrow-right-20-filled" />
          <UFormGroup name="to">
            <UInput v-model="state.to" placeholder="To volume" />
          </UFormGroup>
        </div>
        <UFormGroup name="price">
          <UInput v-model="state.price" type="number" placeholder="Price">
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">VND</span>
            </template>
          </UInput>
        </UFormGroup>

        <UButton type="submit" :pending="pending">Create</UButton>
      </form>
    </UCard>
  </UModal>
</template>
