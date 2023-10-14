<script setup lang="ts">
import {
  Collections,
  type StaffsResponse,
  type TitlesResponse,
} from "@/types/pb";

const { $pb } = useNuxtApp();
const { pending, create } = useWork();

const props = defineProps<{
  modelValue: boolean;
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [void];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const { data: staff } = await useAsyncData(
  () =>
    $pb.collection(Collections.Staffs).getList<StaffsResponse>(1, 15, {
      sort: "+created",
    }),
  {
    transform: (data) =>
      data.items.map((staff) => ({
        id: staff.id,
        label: staff.name,
      })),
  },
);

if (!staff.value) throw createError({ statusCode: 500 });

const state = ref<{
  name: string;
}>({
  name: "",
});

const selected = ref<{
  id: string;
  label: string;
}>();

const label = computed({
  get: () => selected.value,
  set: async (staff) => {
    if (staff?.id) return (selected.value = staff);

    if (staff?.label) {
      const res = await $pb
        .collection(Collections.Staffs)
        .create<StaffsResponse>({
          name: staff.label,
        });

      if (res)
        selected.value = {
          id: res.id,
          label: res.name,
        };
    }
  },
});

const search = async (query: string) => {
  const res = await $pb
    .collection(Collections.Staffs)
    .getList<StaffsResponse>(1, 15, {
      filter: `name~'${query}'`,
    });

  return res.items.map((staff) => ({
    id: staff.id,
    label: staff.name,
  }));
};

const handleCreate = async () => {
  await create({
    title: props.title.id,
    staff: selected.value?.id,
    name: state.value.name,
  });
  isOpen.value = false;
  emit("change");
};
</script>

<template>
  <USlideover v-model="isOpen">
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Attach a staff for</span>
        {{ title.name }}
      </AppH2>

      <form class="space-y-6" @submit.prevent="handleCreate">
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
      </form>
    </div>
  </USlideover>
</template>
