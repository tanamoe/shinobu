import {
  Collections,
  type FormatsResponse,
  type DemographicsResponse,
  type GenresResponse,
} from "@/types/pb";

export function useMeta() {
  const { $pb } = useNuxtApp();

  const demographics = useState<DemographicsResponse[]>(() => []);
  const formats = useState<FormatsResponse[]>(() => []);
  const genres = useState<GenresResponse[]>(() => []);

  async function update() {
    const d = await $pb.collection(Collections.Demographics).getFullList();
    if (d) {
      demographics.value = d;
    }

    const f = await $pb.collection(Collections.Formats).getFullList();
    if (f) {
      formats.value = f;
    }

    const g = await $pb.collection(Collections.Genres).getFullList();
    if (g) {
      genres.value = g;
    }
  }

  return { demographics, formats, genres, update };
}
