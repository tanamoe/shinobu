import { ClientResponseError } from "pocketbase";
import {
  Collections,
  type ReleasesRecord,
  type ReleasesResponse,
} from "@/types/pb";

export function useRelease() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(release: Partial<ReleasesRecord> | FormData) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Releases)
        .create<ReleasesResponse>(release);

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
    release: Partial<ReleasesRecord> | FormData,
  ) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Releases)
        .update<ReleasesResponse>(id, release);

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
