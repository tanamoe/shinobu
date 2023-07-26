import {
  Collections,
  type ReleaseRecord,
  type ReleaseResponse,
} from "@/types/pb";

export const useCreateRelease = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  return useAsyncState(
    async (release: Partial<ReleaseRecord> | FormData) => {
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
      } catch (err) {
        toast.add({
          id: "error",
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
