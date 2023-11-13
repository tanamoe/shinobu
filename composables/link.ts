import { ClientResponseError } from "pocketbase";
import { Collections, type LinksRecord } from "@/types/pb";

// naming for conflict with vue useLink
export function useTitleLink() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(data: Partial<LinksRecord> | FormData) {
    pending.value = true;

    try {
      const res = await $pb.collection(Collections.Links).create(data);

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
