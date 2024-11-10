<script setup lang="ts">
import slug from "slug";
import type { RecordIdString } from "~/types/pb";

interface Props {
  name?: string;
  multiple?: boolean;
}

interface Model {
  file: File;
  description: string;
  type: RecordIdString;
}

const props = defineProps<Props>();

const model = defineModel<Model | Model[]>();

const files = ref<File | File[]>();

function toModel(file: File) {
  return {
    file: new File(
      [file],
      props.name ? slug(props.name) : self.crypto.randomUUID(),
      { type: file.type },
    ),
    description: "",
    type: "",
  };
}

function preview(file: File) {
  return URL.createObjectURL(file);
}

function upload(files: File | File[]) {
  if (props.multiple && Array.isArray(files)) {
    if (Array.isArray(model.value))
      model.value = model.value.concat([...files].map(toModel));
    else model.value = [...files].map(toModel);
  } else if (!props.multiple && !Array.isArray(files)) {
    model.value = toModel(files);
  }
}

function remove(i: number) {
  if (Array.isArray(model.value)) {
    model.value.splice(i, 1);
  } else {
    model.value = undefined;
  }
}

watch(files, () => {
  if (files.value) {
    if (Array.isArray(files.value)) {
      if (props.multiple) {
        if (Array.isArray(model.value))
          model.value = model.value.concat([...files.value].map(toModel));
        else model.value = [...files.value].map(toModel);
      }
    } else {
      model.value = toModel(files.value);
    }
  }
});
</script>

<template>
  <div class="space-y-3">
    <div v-for="(file, i) in Array.isArray(model) ? model : [model]" :key="i">
      <div v-if="file" class="flex gap-3">
        <img
          :src="preview(file.file)"
          class="rounded w-32 object-contain aspect-[2/3] bg-gray-200 dark:bg-gray-800"
        />
        <div class="flex-1 flex justify-between flex-col">
          {{ file.file.name }}
          <div class="space-y-3">
            <UTextarea v-model="file.description" placeholder="Description" />
            <InputAssetTypes v-model="file.type" placeholder="Type" />
          </div>
          <div class="text-right">
            <UButton
              variant="ghost"
              size="sm"
              icon="i-fluent-delete-20-filled"
              color="red"
              @click="remove(i)"
            />
          </div>
        </div>
      </div>
    </div>

    <InputFileDrop :multiple @change="upload" />
  </div>
</template>
