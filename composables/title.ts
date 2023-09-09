import { ClientResponseError } from "pocketbase";
import { Collections, type TitleRecord, type TitleResponse } from "@/types/pb";

export function useTitle() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function update(id: string, data: Partial<TitleRecord> | FormData) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Title)
        .update<TitleResponse>(id, data);

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

  return { pending, update };
}
