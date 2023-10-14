import { Collections, type BooksRecord, type BooksResponse } from "@/types/pb";
import { ClientResponseError } from "pocketbase";

export function useBook() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(book: Partial<BooksRecord> | FormData) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Books)
        .create<BooksResponse>(book);

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

  async function update(id: string, book: Partial<BooksRecord> | FormData) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Books)
        .update<BooksResponse>(id, book);

      toast.add({
        title: `Success!`,
        description: `Updated ${res.edition}`,
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
      const res = await $pb.collection(Collections.Books).delete(id);

      toast.add({
        title: `Success!`,
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
