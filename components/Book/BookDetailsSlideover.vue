<script setup lang="ts">
import slug from "slug";
import {
  type BookResponse,
  Collections,
  type PublicationResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { pending, create, update, remove } = useBook();

const props = defineProps<{
  modelValue: boolean;
  publication: PublicationResponse;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [void];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const publication = computed(() => props.publication);

const {
  pending: booksPending,
  data,
  refresh,
} = await useAsyncData(
  () =>
    $pb.collection(Collections.Book).getFullList<BookResponse>({
      filter: `publication.id = '${publication.value.id}'`,
    }),
  {
    watch: [publication],
    transform: (data) =>
      data.map((book) => ({
        ...book,
        publishDate: book.publishDate.split(" ")[0],
      })),
  },
);

async function handleUpdate(e: Event, book: Partial<BookResponse>) {
  const formData = new FormData(e.target as HTMLFormElement);

  book.cover?.map((cover) => formData.append("cover", cover));

  await update(book.id!, formData);

  refresh();
  emit("change");
}

const handleCreate = async (e: Event) => {
  const formData = new FormData(e.target as HTMLFormElement);

  formData.append("publication", publication.value.id!);

  const files = formData.getAll("cover");
  formData.delete("cover");

  files.forEach((file) => {
    if (file instanceof File) {
      const newFile = new File(
        [file],
        slug(props.publication.name) + "." + file.name.split(".").at(-1),
        {
          type: file.type,
        },
      );

      formData.append("cover", newFile);
    }
  });

  await create(formData);

  refresh();
};
</script>

<template>
  <USlideover v-model="isOpen">
    <div class="p-6 overflow-y-scroll">
      <AppH2>
        {{ publication.name }}
        <span class="text-zinc-400">books</span>
      </AppH2>

      <div v-if="booksPending">
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
            <UFormGroup label="Edition">
              <UInput v-model="book.edition" name="edition" />
            </UFormGroup>
            <UFormGroup label="Publish date">
              <UInput
                v-model="book.publishDate"
                type="date"
                name="publishDate"
              />
            </UFormGroup>
            <UFormGroup label="Price">
              <UInput v-model="book.price" type="number" name="price">
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">
                    VND
                  </span>
                </template>
              </UInput>
            </UFormGroup>
            <UFormGroup label="Cover">
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
              <UInput class="mt-3" type="file" name="cover" multiple />
            </UFormGroup>
            <div class="text-right space-x-3">
              <UButton
                label="Delete"
                :pending="pending"
                variant="ghost"
                color="red"
                @click="remove(book.id)"
              />
              <UButton label="Save" :pending="pending" type="submit" />
            </div>
          </form>
        </UCard>

        <UCard>
          <form class="space-y-6" @submit.prevent="handleCreate">
            <UFormGroup label="Edition">
              <UInput name="edition" />
            </UFormGroup>
            <UFormGroup label="Publish date">
              <UInput type="date" name="publishDate" />
            </UFormGroup>
            <UFormGroup label="Price">
              <UInput type="number" name="price">
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
                :pending="pending"
              />
            </div>
          </form>
        </UCard>
      </div>
    </div>
  </USlideover>
</template>
