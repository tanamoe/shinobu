import {
  Collections,
  type PublicationsRecord,
  type PublicationsResponse,
  type ReleasesResponse,
  type BooksResponse,
} from "@/types/pb";
import { ClientResponseError } from "pocketbase";

export function usePublication() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(
    publication:
      | (Partial<PublicationsRecord> | { covers?: File[] | File })
      | FormData,
  ) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Publications)
        .create(publication);

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
    release: ReleasesResponse,
    from: number,
    to: number,
    price?: number,
    digital?: boolean,
  ) {
    pending.value = true;

    try {
      for (let i = from; i <= to; i++) {
        const res = await $pb
          .collection(Collections.Publications)
          .create<PublicationsResponse>({
            release: release.id,
            name: `${release.name} - Tập ${i}`,
            volume: i * 10000,
            digital,
          });

        await $pb.collection(Collections.Books).create<BooksResponse>({
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
    publication:
      | (Partial<PublicationsRecord> | { covers?: File[] | File })
      | FormData,
  ) {
    pending.value = true;

    try {
      const res = await $pb
        .collection(Collections.Publications)
        .update<PublicationsResponse>(id, publication);

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
      const res = await $pb.collection(Collections.Publications).delete(id);

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
