import { z } from "zod";
import * as cheerio from "cheerio";
import type { ThirdPartySchema } from "../utils/common";
import type { CommonResponse } from "../types/common";

const schema = z.object({
  url: z.string().url().includes("fahasa.com"),
});

export default defineEventHandler(async function (event): Promise<
  CommonResponse<ThirdPartySchema, unknown>
> {
  const { data, error } = await getValidatedQuery(event, (body) =>
    schema.safeParse(body),
  );

  if (error) {
    return {
      success: false,
      error,
    };
  }

  const { url } = data;

  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);

    const price = $(".price-block .old-price .price")
      .text()
      .trim()
      .replace(/\D/g, "");

    const table = $(".table-additional");
    const rows = table.find("tr");

    const additionalDetails = [...rows].map((row) => [
      $(row).find("th").text().trim(),
      $(row).find("td").text().trim(),
    ]);

    const rawData: { [k in keyof ThirdPartySchema]: unknown } = {
      price,
    };

    for (const [key, value] of additionalDetails) {
      const mappedKey = fahasaAdditionalDetailsKeys[key];
      rawData[mappedKey] = value;
    }

    const gallery = $("#lightgallery-product-media");
    const images = gallery.find("img");

    rawData.images = [...images].map((img) => $(img).attr("src"));

    const data = thirdPartySchema.parse(rawData);

    return {
      success: true,
      data,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: new Error("Unknown error"),
    };
  }
});

const fahasaAdditionalDetailsKeys: {
  [k: string]: keyof ThirdPartySchema;
} = {
  "Mã hàng": "sku",
  "Độ Tuổi": "age",
  "Tên Nhà Cung Cấp": "supplier",
  "Tác giả": "author",
  "Người Dịch": "translator",
  NXB: "publisher",
  "Ngôn Ngữ": "language",
  "Trọng lượng (gr)": "weight",
  "Kích Thước Bao Bì": "size",
  "Số trang": "pageCount",
  "Hình thức": "printType",
};
