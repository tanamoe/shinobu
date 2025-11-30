import { parse } from "@std/csv/parse";
import type {
  FormatsResponse,
  PublishersResponse,
  ReleasesResponse,
  TitlesResponse,
} from "~/types/pb";

export type BookImportBook = Record<
  "release" | "name" | "edition" | "date",
  string
> & {
  volume: number;
  price: number;
};

export type BookImportRelease = {
  name: string;
  release?: ReleasesResponse<{
    publisher: PublishersResponse;
    partner: PublishersResponse;
    title: TitlesResponse<
      unknown,
      {
        format: FormatsResponse;
      }
    >;
  }>;
};

export function csvBookImport(
  text: string,
): [null, [BookImportBook[], BookImportRelease[]]] | [string, null] {
  try {
    const _content = parse(text, {
      columns: ["release", "volume", "name", "edition", "price", "date"],
    });

    const book = _content.map((c) => {
      const _volume = c.volume.split(".");
      let volume = parseInt(_volume[0] ?? "0") * 10000;
      if (_volume[1]) volume += parseInt(_volume[1]);

      return {
        ...c,
        volume,
        price: parseInt(c.price),
        date: c.date.replaceAll("/", "-"),
      };
    });

    const release = _content.reduce(
      (a, c) =>
        a.find((r) => r.name === c.release) !== undefined
          ? a
          : [...a, { name: c.release }],
      [] as {
        name: string;
        release?: ReleasesResponse<{
          publisher: PublishersResponse;
          partner: PublishersResponse;
          title: TitlesResponse<
            unknown,
            {
              format: FormatsResponse;
            }
          >;
        }>;
      }[],
    );

    return [null, [book, release]];
  } catch (err: unknown) {
    return ["", null];
  }
}
