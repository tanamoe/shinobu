import {
  Collections,
  type AssetsRecord,
  type BooksRecord,
  type BooksResponse,
} from "@/types/pb";
import { ClientResponseError } from "pocketbase";

export function useAsset() {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const pending = ref(false);

  async function create(
    asset: Omit<Partial<AssetsRecord>, "image"> & {
      image: File;
    },
  ) {
    pending.value = true;

    try {
      const res = await $pb.collection(Collections.Assets).create(asset);

      toast.add({
        title: "Success!",
        description: `Uploaded ${asset.image.name}`,
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

  async function update(
    id: string,
    asset: Omit<Partial<AssetsRecord>, "image"> & {
      image: File;
    },
  ) {
    pending.value = true;

    try {
      const res = await $pb.collection(Collections.Assets).update(id, asset);

      toast.add({
        title: "Success!",
        description: `Updated ${res.image}`,
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
      const res = await $pb.collection(Collections.Assets).delete(id);

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
