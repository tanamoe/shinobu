import type { PublicationsResponse } from "@/types/pb";

export function useReleasePage() {
  const publication = useState<PublicationsResponse | undefined>();

  const editOpen = useState(() => false);
  const removeOpen = useState(() => false);
  const booksOpen = useState(() => false);

  function edit(p: PublicationsResponse) {
    editOpen.value = true;
    publication.value = p;
  }

  function remove(p: PublicationsResponse) {
    removeOpen.value = true;
    publication.value = p;
  }

  function books(p: PublicationsResponse) {
    booksOpen.value = true;
    publication.value = p;
  }

  return { publication, editOpen, removeOpen, booksOpen, edit, remove, books };
}
