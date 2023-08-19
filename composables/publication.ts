import { Collections, type PublicationResponse } from "@/types/pb";

export const useCreatePublication = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(publication: Partial<PublicationResponse> | FormData) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Publication)
        .create<PublicationResponse>(publication);

      toast.add({
        title: `Success`,
        description: `Created ${res.name}`,
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
    } finally {
      pending.value = false;
    }
  }

  return { pending, create };
};

export const useUpdatePublication = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  return useAsyncState(
    async (
      id: string,
      publication: Partial<PublicationResponse> | FormData,
    ) => {
      try {
        const res = await $pb
          .collection(Collections.Publication)
          .update<PublicationResponse>(id, publication);

        toast.add({
          title: `Success`,
          description: `Updated ${res.name}`,
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

export const useDeletePublication = () => {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  return useAsyncState(
    async (id: string) => {
      try {
        await $pb.collection(Collections.Publication).delete(id);

        toast.add({
          title: `Success`,
          description: `Deleted`,
          icon: "i-fluent-checkmark-circle-20-filled",
          color: "green",
        });
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
