import { ClientResponseError } from "pocketbase";
import {
  Collections,
  type ReleaseRecord,
  type ReleaseResponse,
} from "@/types/pb";

export function useRelease() {
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
        title: `Success`,
        icon: "i-fluent-checkmark-circle-20-filled",
        color: "green",
      });

      return res;
    } catch (err) {
      if (err instanceof ClientResponseError) {
        toast.add({
          title: "An error occurred.",
          description: err.message,
          icon: "i-fluent-error-circle-20-filled",
          color: "red",
        });
      }
    } finally {
      pending.value = false;
    }
  }

  async function update(
    id: string,
    release: Partial<ReleaseRecord> | FormData,
  ) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Release)
        .update<ReleaseResponse>(id, release);

      toast.add({
        title: `Success`,
        icon: "i-fluent-checkmark-circle-20-filled",
        color: "green",
      });

      return res;
    } catch (err) {
      if (err instanceof ClientResponseError) {
        toast.add({
          title: "An error occurred.",
          description: err.message,
          icon: "i-fluent-error-circle-20-filled",
          color: "red",
        });
      }
    } finally {
      pending.value = false;
    }
  }

  return { pending, create, update };
}
