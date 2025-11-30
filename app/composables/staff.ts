import { ClientResponseError } from "pocketbase";
import { Collections, type StaffsResponse } from "@/types/pb";

export function useStaff() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(data: Partial<StaffsResponse> | FormData) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Staffs)
        .create<StaffsResponse>(data);

      toast.add({
        title: `Success`,
        icon: "i-fluent-checkmark-circle-20-filled",
        color: "success",
      });

      return res;
    } catch (error) {
      if (error instanceof ClientResponseError)
        toast.add({
          title: "Error",
          description: error.message,
          icon: "i-fluent-error-circle-20-filled",
          color: "error",
        });
      else console.error(error);
    } finally {
      pending.value = false;
    }
  }

  return { pending, create };
}
