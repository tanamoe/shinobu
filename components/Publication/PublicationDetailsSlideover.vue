<script setup lang="ts">
import slug from "slug";
import { PublicationsResponse } from "@/types/pb";

const { pending, update } = usePublication();

const props = defineProps<{
  modelValue: boolean;
  publication: PublicationsResponse;
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

async function handleUpdate(
  e: Event,
  publication: Partial<PublicationsResponse>,
) {
  const formData = new FormData(e.target as HTMLFormElement);

  const files = formData.getAll("cover");
  formData.delete("cover");

  formData.set("digital", JSON.stringify(publication.digital));

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

  await update(publication.id!, formData);

  emit("change");
}
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
        <UFormGroup label="Name">
          <UInput v-model="publication.name" name="name" />
        </UFormGroup>
        <UFormGroup label="Volume">
          <UInput v-model="publication.volume" name="volume" />
        </UFormGroup>
        <UFormGroup label="Digital">
          <UToggle v-model="publication.digital" name="digital" />
        </UFormGroup>
        <UFormGroup label="Cover">
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
          <UInput class="mt-3" type="file" multiple name="cover" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </form>
    </div>
  </USlideover>
</template>
