import { Collections, type BookRecord, type BookResponse } from "@/types/pb";

export const useCreateBook = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  return useAsyncState(
    async (book: Partial<BookRecord> | FormData) => {
      try {
        const res = await $pb
          .collection(Collections.Book)
          .create<BookResponse>(book);

        toast.add({
          title: `Success`,
          icon: "i-fluent-checkmark-circle-20-filled",
          color: "green",
        });

        return res;
      } catch (err) {
        toast.add({
          title: "An error occurred.",
          icon: "i-fluent-error-circle-20-filled",
          color: "red",
        });
        console.error(err);
      }
    },
    null,
    {
      immediate: false,
    },
  );
};

export const useUpdateBook = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  return useAsyncState(
    async (id: string, book: Partial<BookRecord> | FormData) => {
      try {
        const res = await $pb
          .collection(Collections.Book)
          .update<BookResponse>(id, book);

        toast.add({
          title: `Success!`,
          description: `Updated ${res.edition}`,
          icon: "i-fluent-checkmark-circle-20-filled",
          color: "green",
        });

        return res;
      } catch (err) {
        toast.add({
          title: "An error occurred.",
          icon: "i-fluent-error-circle-20-filled",
          color: "red",
        });
        console.error(err);
      }
    },
    null,
    {
      immediate: false,
    },
  );
};

export const useDeleteBook = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  return useAsyncState(
    async (id: string) => {
      try {
        const res = await $pb.collection(Collections.Book).delete(id);

        toast.add({
          title: `Success!`,
          icon: "i-fluent-checkmark-circle-20-filled",
          color: "green",
        });

        return res;
      } catch (err) {
        toast.add({
          title: "An error occurred.",
          icon: "i-fluent-error-circle-20-filled",
          color: "red",
        });
        console.error(err);
      }
    },
    null,
    {
      immediate: false,
    },
  );
};
