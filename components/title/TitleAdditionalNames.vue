<script setup lang="ts">
import {
  type TitlesResponse,
  type AdditionalTitleNamesResponse,
} from "@/types/pb";
import { ModalAdditionalTitleNameCreate } from "#components";

const modal = useModal();
const { languages } = useMeta();

const props = defineProps<{
  title: TitlesResponse<
    unknown,
    {
      additionalTitleNames_via_title?: AdditionalTitleNamesResponse[];
    }
  >;
}>();

const names = computed(
  () => props.title.expand?.additionalTitleNames_via_title,
);

const emit = defineEmits<{
  change: [];
}>();

function create(title: TitlesResponse) {
  modal.open(ModalAdditionalTitleNameCreate, {
    title,
    onChange: () => emit("change"),
  });
}
</script>

<template>
  <section>
    <AppH2>
      Additional Names
      <span class="float-right space-x-3">
        <UButton
          variant="ghost"
          color="gray"
          icon="i-fluent-arrow-clockwise-20-filled"
          @click="() => $emit('change')"
        >
          Refresh
        </UButton>
        <UButton
          color="gray"
          icon="i-fluent-add-square-multiple-20-filled"
          class="float-right"
          @click="create(title)"
        >
          Create
        </UButton>
      </span>
    </AppH2>

    <div v-if="names" class="divide-y divide-gray-200 dark:divide-gray-800">
      <p v-for="name in names" :key="name.id" class="py-1">
        {{ languages.find((lang) => lang.id === name.language)?.emoji }}
        {{ name.name }}
      </p>
    </div>
  </section>
</template>
