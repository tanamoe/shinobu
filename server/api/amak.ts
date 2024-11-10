import { z } from "zod";
import * as cheerio from "cheerio";
import type { ThirdPartySchema } from "../utils/common";
import type { CommonResponse } from "../types/common";
import { withHttps } from "ufo";

const schema = z.object({
  url: z.string().url().includes("amakstore.vn"),
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

    const list = $(".description-productdetail ul");
    const items = list.find("li");

    console.table([...items].map((item) => $(item).text().trim()));
    const additionalDetails = [...items].map((item) =>
      $(item)
        .text()
        .split(/: (.*)/s),
    );

    const rawData: { [k in keyof ThirdPartySchema]: unknown } = {};

    for (const [key, value] of additionalDetails) {
      const mappedKey = amakAdditionalDetailsKeys[key];
      rawData[mappedKey] = value;
    }

    const gallery = $(".productList-thumb");
    const images = gallery.find("img");

    rawData.images = [...images].map((img) =>
      withHttps($(img).attr("src")!.replace("_compact", "")),
    );

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

const amakAdditionalDetailsKeys: {
  [k: string]: keyof ThirdPartySchema;
} = {
  "Khổ sách": "size",
  "Số trang": "pageCount",
  "Trọng lượng": "weight",
  "Giá bán": "price",
  ISBN: "isbn",
  "Dịch giả": "translator",
  "Tác giả": "author",
  "NXB liên kết": "publisher",
  "Quà tặng kèm": "note",
};
