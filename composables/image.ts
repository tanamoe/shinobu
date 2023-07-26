import type { BaseSystemFields } from "@/types/pb";
import { joinURL } from "ufo";

export type PocketbaseImageFields = Pick<
  BaseSystemFields,
  "id" | "collectionId"
>;

export const usePocketbaseImage = (
  record: PocketbaseImageFields,
  fileName: string,
  query: string = "",
) => {
  const runtimeConfig = useRuntimeConfig();

  return joinURL(
    runtimeConfig.public.pocketbaseUrl,
    "/api/files",
    record.collectionId,
    record.id,
    fileName,
    query,
  );
};
