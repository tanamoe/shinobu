import type {
  PublicationsRecord,
  ReleasesResponse,
  BooksRecord,
} from "@/types/pb";

export type BulkBook = Pick<BooksRecord, "edition" | "publishDate"> & {
  price: string;
};

export type BulkPublication = Pick<PublicationsRecord, "name"> & {
  volume: string;
  books: BulkBook[];
};

export type BulkData = {
  priority: number;
  release?: ReleasesResponse;
  publications: BulkPublication[];
};

export const bulkDefaultBook = {
  edition: "",
  price: "",
  publishDate: "",
};

export const bulkDefaultPublication: BulkPublication = {
  volume: "",
  name: "",
  books: [structuredClone(bulkDefaultBook)],
};

export const bulkDefaultData: BulkData = {
  priority: 1,
  publications: [structuredClone(bulkDefaultPublication)],
};

export const useBulkStore = defineStore("bulk", () => {
  const data = ref<BulkData[]>([structuredClone(bulkDefaultData)]);

  function latest() {
    return data.value[data.value.length - 1];
  }

  function push(d: BulkData) {
    data.value.push(d);
  }

  return { data, latest, push };
});
