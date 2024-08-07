<script setup lang="ts">
import slug from "slug";
import { type TitlesResponse } from "@/types/pb";

const { $pb } = useNuxtApp();
const { update, pending } = useTitle();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const state = ref({
  cover: "",
});

const showUpload = ref(false);
const fileInput = ref<HTMLInputElement>();
const fileInputForm = ref<HTMLFormElement>();
const previewImg = ref<HTMLImageElement>();

function openFileUpload() {
  fileInput.value?.click();
}

async function handleUploadCover() {
  const formData = new FormData(fileInputForm.value);

  const files = formData.getAll("cover");
  formData.delete("cover");

  files.forEach((file) => {
    if (file instanceof File) {
      if (file.size > 0) {
        const newFile = new File(
          [file],
          slug(props.title.name) + "." + file.name.split(".").at(-1),
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

  const res = await update(props.title.id, formData);
  if (res) emit("change");
}

async function handleDeleteCover() {
  const res = await update(props.title.id, { cover: "" });
  if (res) emit("change");
  state.value.cover = "";
}

function handleShowPreview() {
  if (fileInput.value?.files)
    state.value.cover = window.URL.createObjectURL(fileInput.value.files[0]);
}
</script>

<template>
  <div>
    <div
      class="w-72 h-auto rounded-md group overflow-hidden relative"
      @mouseenter="showUpload = true"
      @mouseleave="showUpload = false"
    >
      <img
        v-if="state.cover"
        ref="previewImg"
        class="group-hover:filter group-hover:brightness-50 transition-all"
        :src="state.cover"
        @click="openFileUpload"
      />
      <img
        v-else-if="title.cover"
        class="group-hover:filter group-hover:brightness-50 transition-all"
        :src="$pb.files.getUrl(title, title.cover)"
        @click="openFileUpload"
      />
      <div
        v-else
        class="aspect-[2/3] h-full w-full bg-gray-800"
        @click="openFileUpload"
      />
      <div v-if="showUpload" class="z-10 absolute top-3 right-3 space-x-3">
        <UButton
          icon="i-fluent-arrow-upload-20-filled"
          color="gray"
          :pending="pending"
          @click="handleUploadCover"
        >
          Upload
        </UButton>
        <UButton
          icon="i-fluent-delete-20-filled"
          color="gray"
          square
          :pending="pending"
          @click="handleDeleteCover"
        />
      </div>
    </div>

    <form ref="fileInputForm">
      <UFormGroup v-show="false">
        <input
          ref="fileInput"
          type="file"
          name="cover"
          @change="handleShowPreview"
        />
      </UFormGroup>
    </form>
  </div>
</template>
