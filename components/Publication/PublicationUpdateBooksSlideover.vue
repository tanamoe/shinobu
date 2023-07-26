<script setup lang="ts">
import { BookResponse, Collections, PublicationResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { isLoading: createPending, execute: createBook } = useCreateBook();
const { isLoading: updatePending, execute: updateBook } = useUpdateBook();
const { isLoading: deletePending, execute: deleteBook } = useDeleteBook();

const props = defineProps<{
  modelValue: boolean;
  publication: Partial<PublicationResponse>;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const publication = computed(() => props.publication);

const { pending, data, refresh } = await useAsyncData(
  () =>
    $pb.collection(Collections.Book).getFullList<BookResponse>({
      filter: `publication.id = '${publication.value.id}'`,
    }),
  {
    watch: [publication],
    transform: (data) =>
      data.map((book) => ({
        ...book,
        publish_date: book.publish_date.split(" ")[0],
      })),
  },
);

const handleUpdate = (e: Event, book: Partial<BookResponse>) => {
  const formData = new FormData(e.target as HTMLFormElement);

  book.cover?.map((cover) => formData.append("cover", cover));

  updateBook(0, book.id!, formData);
};

const handleCreate = async (e: Event) => {
  const formData = new FormData(e.target as HTMLFormElement);

  formData.append("publication", publication.value.id!);

  await createBook(0, formData);
};

watch([createPending, updatePending, deletePending], () => refresh());
</script>

<template>
  <USlideover v-model="isOpen">
    <div class="p-6 overflow-y-scroll">
      <AppH2>
        {{ publication.name }}
        <span class="text-zinc-400">books</span>
      </AppH2>

      <div v-if="pending">
        <UCard class="space-y-6">
          <div class="space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
          <div class="space-y-2">
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-4 w-full" />
          </div>
        </UCard>
      </div>

      <div v-else-if="data" class="space-y-6">
        <UCard v-for="book in data" :key="book.id">
          <form
            class="space-y-6"
            @submit.prevent="(e) => handleUpdate(e, book)"
          >
            <UFormGroup name="edition" label="Edition">
              <UInput v-model="book.edition" />
            </UFormGroup>
            <UFormGroup name="publish_date" label="Publish date">
              <UInput v-model="book.publish_date" type="date" />
            </UFormGroup>
            <UFormGroup name="price" label="Price">
              <UInput v-model="book.price" type="number">
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">
                    VND
                  </span>
                </template>
              </UInput>
            </UFormGroup>
            <UFormGroup name="cover" label="Cover">
              <div class="space-y-3">
                <div
                  v-for="image in book.cover"
                  :key="image"
                  class="flex gap-3 items-center"
                >
                  <img
                    :src="usePocketbaseImage(book, image, '?thumb=100x100')"
                    class="flex-shrink-0 w-12 rounded"
                  />
                  <div
                    class="overflow-hidden whitespace-nowrap text-ellipsis flex-1"
                  >
                    {{ image }}
                  </div>
                  <UButton
                    variant="ghost"
                    icon="i-fluent-delete-20-filled"
                    color="red"
                    square
                    @click="
                      {
                        const index = book.cover.indexOf(image);
                        if (index > -1) book.cover.splice(index, 1);
                      }
                    "
                  />
                </div>
              </div>
              <UInput class="mt-3" type="file" multiple />
            </UFormGroup>
            <div class="text-right space-x-3">
              <UButton
                label="Delete"
                :pending="deletePending"
                variant="ghost"
                color="red"
                @click="deleteBook(0, book.id)"
              />
              <UButton label="Save" :pending="updatePending" type="submit" />
            </div>
          </form>
        </UCard>

        <UCard>
          <form class="space-y-6" @submit.prevent="handleCreate">
            <UFormGroup name="edition" label="Edition">
              <UInput />
            </UFormGroup>
            <UFormGroup name="publish_date" label="Publish date">
              <UInput type="date" />
            </UFormGroup>
            <UFormGroup name="price" label="price">
              <UInput label="Price" type="number">
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">
                    VND
                  </span>
                </template>
              </UInput>
            </UFormGroup>
            <div class="text-right space-x-3">
              <UButton
                label="Create"
                icon="i-fluent-add-20-filled"
                type="submit"
                :pending="createPending"
              />
            </div>
          </form>
        </UCard>
      </div>
    </div>
  </USlideover>
</template>
