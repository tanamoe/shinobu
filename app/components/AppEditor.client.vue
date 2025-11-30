<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";

const model = defineModel<string>();

const url = ref<string>();

const editor = useEditor({
  content: model.value,
  extensions: [StarterKit, Underline, CharacterCount, Link],
  onUpdate: () => {
    model.value = editor.value!.getHTML();
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
    class="dark:text-white ring-1 ring-inset ring-(--ui-border-accented) focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded-md"
  >
    <div
      v-if="editor"
      class="flex divide-x divide-(--ui-border-accented) gap-1 border-b border-(--ui-border-accented)"
    >
      <div class="flex gap-1 px-2.5 py-1.5">
        <UTooltip text="Bold" :kbds="['meta', 'B']">
          <UButton
            color="neutral"
            :variant="editor.isActive('bold') ? 'soft' : 'ghost'"
            icon="i-fluent-text-bold-20-filled"
            :disabled="!editor.can().chain().focus().toggleBold().run()"
            square
            tabindex="-1"
            @click="editor.chain().focus().toggleBold().run()"
          />
        </UTooltip>
        <UTooltip text="Italic" :kbds="['meta', 'I']">
          <UButton
            color="neutral"
            :variant="editor.isActive('italic') ? 'soft' : 'ghost'"
            icon="i-fluent-text-italic-20-filled"
            :disabled="!editor.can().chain().focus().toggleItalic().run()"
            square
            tabindex="-1"
            @click="editor.chain().focus().toggleItalic().run()"
          />
        </UTooltip>
        <UTooltip text="Underline" :kbds="['meta', 'U']">
          <UButton
            color="neutral"
            :variant="editor.isActive('underline') ? 'soft' : 'ghost'"
            icon="i-fluent-text-underline-20-filled"
            :disabled="!editor.can().chain().focus().toggleUnderline().run()"
            square
            tabindex="-1"
            @click="editor.chain().focus().toggleUnderline().run()"
          />
        </UTooltip>
        <UTooltip text="Strikethrough" :kbds="['meta', 'Shift', 'X']">
          <UButton
            color="neutral"
            :variant="editor.isActive('strike') ? 'soft' : 'ghost'"
            icon="i-fluent-text-strikethrough-20-filled"
            :disabled="!editor.can().chain().focus().toggleStrike().run()"
            square
            tabindex="-1"
            @click="editor.chain().focus().toggleStrike().run()"
          />
        </UTooltip>
      </div>
      <div class="flex gap-1 px-2.5 py-1.5">
        <UButton
          color="neutral"
          :variant="editor.isActive('heading', { level: 1 }) ? 'soft' : 'ghost'"
          icon="i-fluent-text-header-1-20-filled"
          square
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        />
        <UButton
          color="neutral"
          :variant="editor.isActive('heading', { level: 2 }) ? 'soft' : 'ghost'"
          icon="i-fluent-text-header-2-20-filled"
          square
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        />
        <UButton
          color="neutral"
          :variant="editor.isActive('heading', { level: 3 }) ? 'soft' : 'ghost'"
          icon="i-fluent-text-header-3-20-filled"
          square
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        />
      </div>
      <div class="flex gap-1 px-2.5 py-1.5">
        <UPopover>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-fluent-link-20-filled"
            square
            tabindex="-1"
            @click="() => (url = editor?.getAttributes('link').href)"
          />
          <template #panel>
            <form class="space-y-3 p-3 text-right">
              <UFormGroup name="url">
                <UInput v-model="url" placeholder="https://tana.moe/calendar" />
              </UFormGroup>
              <UButton
                size="xs"
                icon="i-fluent-link-remove-20-filled"
                color="error"
                variant="outline"
                class="mr-3"
                @click="
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .unsetLink()
                    .run()
                "
              >
                Remove
              </UButton>
              <UButton
                size="xs"
                icon="i-fluent-add-20-filled"
                @click="
                  url &&
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange('link')
                    .setLink({ href: url })
                    .run()
                "
              >
                Add
              </UButton>
            </form>
          </template>
        </UPopover>
      </div>
    </div>
    <EditorContent :editor spellcheck="false" />
  </div>
</template>
