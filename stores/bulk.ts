import {
  type PublicationsRecord,
  type ReleasesResponse,
  type BooksRecord,
} from "@/types/pb";

export type BulkBook = Pick<BooksRecord, "edition" | "price" | "publishDate">;

export type BulkPublication = Pick<PublicationsRecord, "volume" | "name"> & {
  asset: string[];
  books: BulkBook[];
};

export type BulkData = {
  priority: number;
  release?: ReleasesResponse;
  publications: BulkPublication[];
};

export const bulkDefaultBook = {
  edition: "",
  price: 0,
  publishDate: "",
};

export const bulkDefaultPublication: BulkPublication = {
  volume: 0,
  name: "",
  asset: [],
  books: [bulkDefaultBook],
};

export const bulkDefaultData: BulkData = {
  priority: 1,
  publications: [bulkDefaultPublication],
};

export const useBulkStore = defineStore("bulk", () => {
  const data = ref<BulkData[]>([bulkDefaultData]);

  function latest() {
    return data.value[data.value.length - 1];
  }

  function push(d: BulkData) {
    data.value.push(d);
  }

  return { data, latest, push };
});
