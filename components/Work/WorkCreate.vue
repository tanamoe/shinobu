<script setup lang="ts">
import { z } from "zod";
import {
  Collections,
  type StaffsResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const { $pb } = useNuxtApp();
const { pending, create } = useWork();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [void];
}>();

const { data: staff } = await useLazyAsyncData(
  () =>
    $pb.collection(Collections.Staffs).getList(1, 15, {
      sort: "-updated",
    }),
  {
    transform: (data) =>
      data.items.map((staff) => ({
        id: staff.id,
        label: staff.name,
      })),
  },
);

const schema = z.object({
  title: z.string(),
  name: z.string(),
  staff: z.object({
    id: z.string(),
    label: z.string(),
  }),
});

type Schema = z.output<typeof schema>;

const isOpen = ref(false);

const state = ref<Partial<Schema>>({
  title: props.title.id,
  name: undefined,
  staff: undefined,
});

const label = computed({
  get: () => state.value.staff,
  set: async (staff) => {
    if (staff?.id) return (state.value.staff = staff);

    if (staff?.label) {
      const res = await $pb.collection(Collections.Staffs).create({
        name: staff.label,
      });

      if (res)
        state.value.staff = {
          id: res.id,
          label: res.name,
        };
    }
  },
});

async function search(query: string) {
  const res = await $pb
    .collection(Collections.Staffs)
    .getList<StaffsResponse>(1, 15, {
      filter: `name~'${query}'`,
      sort: "-updated",
    });

  return res.items.map((staff) => ({
    id: staff.id,
    label: staff.name,
  }));
}

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await create({
    ...event.data,
    staff: event.data.staff.id,
  });

  if (res) {
    isOpen.value = false;
    state.value = {
      title: props.title.id,
      name: undefined,
      staff: undefined,
    };
    emit("change");
  }
}
</script>

<template>
  <UButton
    color="gray"
    icon="i-fluent-add-square-multiple-20-filled"
    class="float-right"
    @click="isOpen = true"
  >
    Create
  </UButton>
  <USlideover v-model="isOpen">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Attach a staff for</span>
        {{ title.name }}
      </AppH2>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormGroup label="Staff">
          <USelectMenu
            v-if="staff"
            v-model="label"
            by="id"
            :options="staff"
            :searchable="search"
            creatable
          >
            <template #option="{ option }">
              <span class="truncate">{{ option.label }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>
        <UFormGroup label="Name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :pending="pending" />
        </div>
      </UForm>
    </div>
  </USlideover>
</template>
