<script setup lang="ts">
import slug from "slug";
import { PublicationResponse } from "@/types/pb";

const { isLoading, execute: updatePublication } = useUpdatePublication();

const props = defineProps<{
  modelValue: boolean;
  publication: PublicationResponse;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const publication = computed(() => props.publication);

const handleUpdate = (e: Event, publication: Partial<PublicationResponse>) => {
  const formData = new FormData(e.target as HTMLFormElement);

  const files = formData.getAll("cover");
  formData.delete("cover");

  files.forEach((file) => {
    if (file instanceof File) {
      if (file.size > 0) {
        const newFile = new File(
          [file],
          slug(props.publication.name) + "." + file.name.split(".").at(-1),
          {
            type: file.type,
          },
        );

        formData.append("cover", newFile);
      } else {
        formData.append("cover", "");
      }
    }
  });

  publication.cover?.map((cover) => formData.append("cover", cover));

  updatePublication(0, publication.id!, formData);
};
</script>

<template>
  <USlideover v-model="isOpen">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Update</span>
        {{ publication.name }}
      </AppH2>

      <form
        class="space-y-6"
        @submit.prevent="(e) => handleUpdate(e, publication)"
      >
        <UFormGroup name="name" label="Name">
          <UInput v-model="publication.name" />
        </UFormGroup>
        <UFormGroup name="volume" label="Volume">
          <UInput v-model="publication.volume" />
        </UFormGroup>
        <UFormGroup name="digital" label="Digital">
          <UToggle v-model="publication.digital" />
        </UFormGroup>
        <UFormGroup name="cover" label="Cover">
          <div class="space-y-3">
            <div
              v-for="image in publication.cover"
              :key="image"
              class="flex gap-3 items-center"
            >
              <img
                :src="usePocketbaseImage(publication, image, '?thumb=100x100')"
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
                    const index = publication.cover.indexOf(image);
                    if (index > -1) publication.cover.splice(index, 1);
                  }
                "
              />
            </div>
          </div>
          <UInput class="mt-3" type="file" multiple />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="isLoading" />
        </div>
      </form>
    </div>
  </USlideover>
</template>
