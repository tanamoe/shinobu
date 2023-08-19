import { ClientResponseError } from "pocketbase";
import {
  Collections,
  type ReleaseRecord,
  type ReleaseResponse,
} from "@/types/pb";

export const useCreateRelease = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(release: Partial<ReleaseRecord> | FormData) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Release)
        .create<ReleaseResponse>(release);

      toast.add({
        id: "create_release",
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
};
