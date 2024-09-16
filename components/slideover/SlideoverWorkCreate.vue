<script setup lang="ts">
import { z } from "zod";
import {
  Collections,
  type StaffsResponse,
  type TitlesResponse,
} from "@/types/pb";
import type { FormSubmitEvent } from "#ui/types";

const { $pb } = useNuxtApp();
const slideover = useSlideover();
const { pending, create } = useWork();

const props = defineProps<{
  title: TitlesResponse;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  title: z.string(),
  name: z.string(),
  staff: z.string(),
});

type Schema = z.output<typeof schema>;

const state = ref<Partial<Schema>>({
  title: props.title.id,
  name: undefined,
  staff: undefined,
});

async function search(query: string) {
  const res = await $pb
    .collection(Collections.Staffs)
    .getList<StaffsResponse>(1, 15, {
      filter: $pb.filter("name ~ {:name}", { name: query }),
      sort: "-updated",
    });

  return res.items.map((staff) => ({
    id: staff.id,
    label: staff.name,
  }));
}

async function submit(event: FormSubmitEvent<Schema>) {
  const res = await create(event.data);

  if (res) {
    slideover.close();
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
  <USlideover>
    <div class="p-6">
      <AppH2>
        <span class="text-zinc-400">Attach a staff for</span>
        {{ title.name }}
      </AppH2>

      <UForm :schema="schema" :state="state" class="space-y-6" @submit="submit">
        <UFormGroup label="Staff" name="staff">
          <UInputMenu
            v-model="state.staff"
            value-attribute="id"
            option-attribute="label"
            :search="search"
            trailing
          />
        </UFormGroup>
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit" label="Save" :loading="pending" />
        </div>
      </UForm>
    </div>
  </USlideover>
</template>
