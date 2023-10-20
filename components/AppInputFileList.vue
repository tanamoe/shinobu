<script setup lang="ts">
const props = defineProps<{
  record: {
    collectionId: string;
  };
  files: string[];
  removeFiles: string[];
}>();

const emit = defineEmits<{
  "update:removeFiles": [string[]];
}>();

const rf = computed({
  get: () => props.removeFiles,
  set: (value) => emit("update:removeFiles", value),
});

function toggle(file: string) {
  if (rf.value.includes(file)) {
    rf.value = rf.value.filter((f) => f !== file);
  } else {
    rf.value.push(file);
  }
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="file in files"
      :key="file"
      class="flex gap-3 items-center"
      :class="{ 'brightness-50': rf.includes(file) }"
    >
      <img
        :src="$pb.files.getUrl(record, file, { thumb: '100x100' })"
        class="flex-shrink-0 w-12 rounded"
      />
      <div
        class="overflow-hidden whitespace-nowrap text-ellipsis flex-1"
        :class="{ 'line-through': rf.includes(file) }"
      >
        {{ file }}
      </div>
      <UButton
        variant="ghost"
        :icon="
          rf.includes(file)
            ? 'i-fluent-delete-arrow-back-20-filled'
            : 'i-fluent-delete-20-filled'
        "
        color="red"
        square
        @click="toggle(file)"
      />
    </div>
  </div>
</template>
