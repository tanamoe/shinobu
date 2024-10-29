<script setup lang="ts">
const emits = defineEmits<{
  change: [];
}>();

const file = defineModel<File>();

const input = ref<HTMLInputElement>();
const dragging = ref(false);

function open() {
  input.value?.click();
}

function dragover() {
  dragging.value = true;
}

function dragleave() {
  dragging.value = false;
}

function drop(event: DragEvent) {
  const _file = event.dataTransfer?.files.item(0);
  if (_file) {
    file.value = _file;
    dragging.value = false;
    emits("change");
  }
}

function change() {
  const _file = input.value?.files?.item(0);
  if (_file) {
    file.value = _file;
    emits("change");
  }
}

const ui = {
  base: "text-center",
  body: {
    base: "flex items-center justify-center flex-col gap-3 cursor-pointer",
    background: "hover:dark:bg-gray-800/30 transition-colors hover:bg-gray-100",
  },
};
</script>

<template>
  <input ref="input" type="file" class="hidden" @change="change" />
  <div
    @drop.prevent="drop"
    @dragover.prevent="dragover"
    @dragleave="dragleave"
    @click="open"
  >
    <UCard :ui>
      <UIcon name="i-fluent-arrow-upload-20-filled" class="w-8 h-8" />
      <template v-if="dragging">Release to upload</template>
      <template v-else-if="file">{{ file.name }}</template>
      <template v-else>
        <span><b>Choose a file</b> or drag to upload</span>
      </template>
    </UCard>
  </div>
</template>
