<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [string];
}>();

const content = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const editor = useEditor({
  content: content.value,
  extensions: [StarterKit, Underline],
  onUpdate: () => {
    content.value = editor.value!.getHTML();
  },
  editorProps: {
    attributes: {
      class:
        "prose prose-sm dark:prose-invert max-w-none px-2.5 py-1.5 mx-auto focus:outline-none min-h-[6rem] max-h-[40vh] overflow-y-auto",
    },
  },
});
</script>

<template>
  <div
    class="shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-md"
  >
    <div
      v-if="editor"
      class="flex divide-x divide-gray-300 dark:divide-gray-700 gap-1 border-b border-gray-300 dark:border-gray-700"
    >
      <div class="flex gap-1 px-2.5 py-1.5">
        <UButton
          color="gray"
          :variant="editor.isActive('bold') ? 'soft' : 'ghost'"
          icon="i-fluent-text-bold-20-filled"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          square
          @click="editor.chain().focus().toggleBold().run()"
        />
        <UButton
          color="gray"
          :variant="editor.isActive('italic') ? 'soft' : 'ghost'"
          icon="i-fluent-text-italic-20-filled"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          square
          @click="editor.chain().focus().toggleItalic().run()"
        />
        <UButton
          color="gray"
          :variant="editor.isActive('underline') ? 'soft' : 'ghost'"
          icon="i-fluent-text-underline-20-filled"
          :disabled="!editor.can().chain().focus().toggleUnderline().run()"
          square
          @click="editor.chain().focus().toggleUnderline().run()"
        />
      </div>
      <div class="flex gap-1 px-2.5 py-1.5">
        <UButton
          color="gray"
          :variant="editor.isActive('heading', { level: 1 }) ? 'soft' : 'ghost'"
          icon="i-fluent-text-header-1-20-filled"
          square
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        />
        <UButton
          color="gray"
          :variant="editor.isActive('heading', { level: 2 }) ? 'soft' : 'ghost'"
          icon="i-fluent-text-header-2-20-filled"
          square
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        />
        <UButton
          color="gray"
          :variant="editor.isActive('heading', { level: 3 }) ? 'soft' : 'ghost'"
          icon="i-fluent-text-header-3-20-filled"
          square
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        />
      </div>
    </div>
    <EditorContent :editor="editor" spellcheck="false" />
  </div>
</template>
