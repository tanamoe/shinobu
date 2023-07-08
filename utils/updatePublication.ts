import type { Record } from "pocketbase";

export const updatePublication = async (publication: Partial<Record>) => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  if (publication.id) {
    try {
      const res = await $pb
        .collection("publication")
        .update(publication.id, publication);

      toast.add({
        id: "update_publication",
        title: `Updated ${res.name}!`,
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
