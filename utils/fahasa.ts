import * as cheerio from "cheerio";
import { parseFilename } from "ufo";

type FahasaData = {
  price?: number;
  images?: File[];
  sku?: string;
  size?: {
    x: number;
    y: number;
    z: number;
  };
  pageCount?: number;
  weight?: number;
};

type FahasaResponse = [FahasaData, null] | [null, Error];

export async function fetchFahasa(url: string): Promise<FahasaResponse> {
  try {
    const response = await fetch(url);
    const body = await response.text();

    const $ = cheerio.load(body);

    const _price = $(".price-block .old-price .price")
      .text()
      .trim()
      .replace(/\D/g, "");

    const _sku = $(".data_sku").text().trim();
    const _count = $(".data_qty_of_page").text().trim();
    const _weight = $(".data_weight").text().trim();

    const _size = $(".data_size").text().trim();
    const _sizes = _size.match(/(?<=^| )\d+(\.\d+)?(?=$| )/g);

    const _gallery = $("#lightgallery-product-media img");

    const _images: File[] = [];

    for (const _img of _gallery) {
      const src = $(_img).attr("src");
      if (src) {
        const image = await fetch(src);
        if (!image.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const blob = await image.blob();
        const file = new File(
          [blob],
          parseFilename(src, { strict: true }) ?? "default.jpg",
        );

        _images.push(file);
      }
    }

    return [
      {
        price: parseInt(_price),
        images: _images,
        sku: _sku.trim(),
        size:
          _sizes && _sizes.length === 3
            ? {
                x: parseFloat(_sizes[0]),
                y: parseFloat(_sizes[1]),
                z: parseFloat(_sizes[2]),
              }
            : undefined,
        pageCount: parseInt(_count),
        weight: parseInt(_weight),
      },
      null,
    ];
  } catch (err: unknown) {
    if (err instanceof Error) {
      return [null, err];
    }

    return [null, new Error("unknown error")];
  }
}
