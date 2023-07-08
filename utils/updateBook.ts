import type { Record } from "pocketbase";

export const updateBook = async (book: Partial<Record>) => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  if (book.id) {
    try {
      const res = await $pb.collection("book").update(book.id, book);

      toast.add({
        id: "update_book",
        title: `Updated ${res.edition}!`,
        icon: "i-fluent-checkmark-circle-20-filled",
        color: "green",
      });
    } catch (err) {
      toast.add({
        id: "error",
        title: "An error occurred.",
        icon: "i-fluent-error-circle-20-filled",
        color: "red",
      });
      console.error(err);
    }
  } else {
    toast.add({
      id: "error",
      title: "An error occurred.",
      description: "Record not found",
      icon: "i-fluent-error-circle-20-filled",
      color: "red",
    });
  }
};
