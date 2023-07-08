import type { Record } from "pocketbase";

export const createRelease = async (release: Partial<Record>) => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  try {
    const res = await $pb.collection("release").create(release);

    toast.add({
      id: "create_release",
      title: `Created ${res.name}!`,
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
};
