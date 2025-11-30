import {
  Collections,
  type FormatsResponse,
  type DemographicsResponse,
  type GenresResponse,
  type AssetTypesResponse,
  type PublishersResponse,
} from "@/types/pb";

export function useMeta() {
  const { $pb } = useNuxtApp();

  const publishers = useState<PublishersResponse[]>(() => []);
  const demographics = useState<DemographicsResponse[]>(() => []);
  const formats = useState<FormatsResponse[]>(() => []);
  const genres = useState<GenresResponse[]>(() => []);
  const assetTypes = useState<AssetTypesResponse[]>(() => []);
  const languages = useState(() => [
    {
      id: "en",
      label: "English",
      emoji: "🇬🇧",
    },
    {
      id: "vi",
      label: "Vietnamese",
      emoji: "🇻🇳",
    },
    {
      id: "jp",
      label: "Japanese",
      emoji: "🇯🇵",
    },
  ]);

  async function update() {
    const p = await $pb.collection(Collections.Publishers).getFullList();
    if (p) {
      publishers.value = p;
    }

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

    const at = await $pb.collection(Collections.AssetTypes).getFullList();
    if (at) {
      assetTypes.value = at;
    }
  }

  return {
    publishers,
    demographics,
    formats,
    genres,
    assetTypes,
    languages,
    update,
  };
}
