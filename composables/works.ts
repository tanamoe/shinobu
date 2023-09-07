import { ClientResponseError } from "pocketbase";
import { Collections, type WorkResponse } from "@/types/pb";

export function useWorks() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function updatePriority(records: WorkResponse[]) {
    pending.value = true;

    for (const [i, record] of records.entries()) {
      try {
        await $pb.collection(Collections.Work).update<WorkResponse>(record.id, {
          priority: i + 1,
        });

        toast.add({
          title: `Success`,
          icon: "i-fluent-checkmark-circle-20-filled",
          color: "green",
        });
      } catch (error) {
        if (error instanceof ClientResponseError)
          toast.add({
            title: "Error",
            description: error.message,
            icon: "i-fluent-error-circle-20-filled",
            color: "red",
          });
        else console.error(error);
      }
    }

    pending.value = false;
  }

  return { pending, updatePriority };
}
