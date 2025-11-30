import {
  Collections,
  type GenresRecord,
  type GenresResponse,
} from "@/types/pb";

export function useGenrePage() {
  const genre = useState<GenresResponse>();

  const isOpen = useState(() => ({
    edit: false,
    create: false,
  }));

  function openEdit(data: GenresResponse) {
    genre.value = data;
    isOpen.value.edit = true;
  }

  function openCreate() {
    isOpen.value.create = true;
  }

  return { genre, isOpen, openEdit, openCreate };
}

export function useGenre() {
  const { $pb } = useNuxtApp();

  const pending = useState(() => false);

  async function update(id: string, data: Partial<GenresRecord>) {
    pending.value = true;

    try {
      const res = await $pb.collection(Collections.Genres).update(id, data);

      return res;
    } catch (e) {
    } finally {
      pending.value = false;
    }
  }

  return { pending, update };
}
