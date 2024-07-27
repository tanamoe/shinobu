import { Collections, type BookMetadataRecord } from "@/types/pb";
import { ClientResponseError } from "pocketbase";

export function useBookMetadata() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(metadata: Partial<BookMetadataRecord>) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.BookMetadata)
        .create(metadata);

      toast.add({
        title: "Success!",
        description: `Uploaded metadata`,
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

  async function update(id: string, metadata: Partial<BookMetadataRecord>) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.BookMetadata)
        .update(id, metadata);

      toast.add({
        title: "Success!",
        description: `Updated metadata`,
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

  async function remove(id: string) {
    pending.value = true;

    try {
      const res = await $pb.collection(Collections.BookMetadata).delete(id);

      toast.add({
        title: "Success!",
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

  return { pending, create, update, remove };
}
