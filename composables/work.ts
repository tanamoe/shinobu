import { ClientResponseError } from "pocketbase";
import { Collections, type WorksResponse } from "@/types/pb";

export function useWork() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(data: Partial<WorksResponse> | FormData) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Works)
        .create<WorksResponse>(data);

      toast.add({
        title: `Success`,
        icon: "i-fluent-checkmark-circle-20-filled",
        color: "green",
      });

      return res;
    } catch (error) {
      if (error instanceof ClientResponseError)
        toast.add({
          title: "Error",
          description: error.message,
          icon: "i-fluent-error-circle-20-filled",
          color: "red",
        });
      else console.error(error);
    } finally {
      pending.value = false;
    }
  }

  return { pending, create };
}
