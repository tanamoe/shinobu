import {
  Collections,
  type PublicationRecord,
  type PublicationResponse,
  type ReleaseResponse,
  type TitleResponse,
  type BookResponse,
} from "@/types/pb";
import { ClientResponseError } from "pocketbase";

export function usePublication() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(publication: Partial<PublicationRecord> | FormData) {
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
      if (err instanceof ClientResponseError) {
        toast.add({
          title: "An error occurred.",
          description: err.message,
          icon: "i-fluent-error-circle-20-filled",
          color: "red",
        });
      }
      console.error(err);
    } finally {
      pending.value = false;
    }
  }

  async function quickCreate(
    release: ReleaseResponse,
    title: TitleResponse,
    from: number,
    to?: number,
    price?: number,
  ) {
    pending.value = true;

    try {
      for (let i = from; i <= (to ?? from); i++) {
        const res = await $pb
          .collection(Collections.Publication)
          .create<PublicationResponse>({
            release: release.id,
            name: `${title.name} - Tập ${i}`,
            volume: i * 10000,
          });

        await $pb.collection(Collections.Book).create<BookResponse>({
          publication: res.id,
          price,
        });
      }

      toast.add({
        title: `Success`,
        description: `Batch created`,
        icon: "i-fluent-checkmark-circle-20-filled",
        color: "green",
      });
    } catch (err) {
      if (err instanceof ClientResponseError) {
        toast.add({
          title: "An error occurred.",
          description: err.message,
          icon: "i-fluent-error-circle-20-filled",
          color: "red",
        });
      }
      console.error(err);
    } finally {
      pending.value = false;
    }
  }

  async function update(
    id: string,
    publication: Partial<PublicationRecord> | FormData,
  ) {
    pending.value = true;

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
      if (err instanceof ClientResponseError) {
        toast.add({
          title: "An error occurred.",
          description: err.message,
          icon: "i-fluent-error-circle-20-filled",
          color: "red",
        });
      }
      console.error(err);
    } finally {
      pending.value = false;
    }
  }

  async function remove(id: string) {
    pending.value = true;

    try {
      const res = await $pb.collection(Collections.Publication).delete(id);

      toast.add({
        title: `Success`,
        description: `Deleted`,
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

  return { pending, create, update, remove, quickCreate };
}
