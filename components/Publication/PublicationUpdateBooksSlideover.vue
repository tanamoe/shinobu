<script setup lang="ts">
import type { Record } from "pocketbase";

const { $pb } = useNuxtApp();

const data = ref();
const books = ref();

const props = defineProps<{
  modelValue: boolean;
  publication: Partial<Record>;
}>();
defineEmits<{
  "update:modelValue": [value: boolean];
}>();

watchEffect(async () => {
  data.value = props.publication;
  books.value = await $pb
    .collection("book")
    .getFullList({ filter: `publication.id = '${data.value.id}'` });
});
</script>

<template>
  <USlideover
    :model-value="modelValue"
    @update:model-value="
      (value: boolean) => {
        $emit('update:modelValue', value);
      }
    "
  >
    <div class="p-6 overflow-y-scroll">
      <AppH2>
        {{ publication.name }}
        <span class="text-zinc-400">books</span>
      </AppH2>

      <div class="space-y-6">
        <UCard v-for="book in books" :key="book.id">
          <form class="space-y-6">
            <UFormGroup name="edition" label="Edition">
              <UInput v-model="book.edition" />
            </UFormGroup>
            <UFormGroup name="publishDate" label="Publish date">
              <UInput v-model="book.publish_date" />
            </UFormGroup>
            <UFormGroup name="price" label="price">
              <UInput v-model="book.price" type="number">
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">
                    VND
                  </span>
                </template>
              </UInput>
            </UFormGroup>
            <div class="text-right space-x-3">
              <UButton
                label="Delete"
                variant="ghost"
                color="red"
                @click="book.id ? updateBook(book) : createBook(book)"
              />
              <UButton
                :label="book.id ? 'Save' : 'Create'"
                @click="book.id ? updateBook(book) : createBook(book)"
              />
            </div>
          </form>
        </UCard>
        <div class="text-center">
          <UButton
            icon="i-fluent-add-20-filled"
            color="gray"
            @click="
              books.push({
                publication: data.id,
              })
            "
          >
            Create
          </UButton>
        </div>
      </div>
    </div>
  </USlideover>
</template>
