import { z } from "zod";
import * as cheerio from "cheerio";
import type { ThirdPartySchema } from "../utils/common";
import type { CommonResponse } from "../types/common";
import { joinURL } from "ufo";

const schema = z.object({
  url: z.string().url().includes("nxbtre.com"),
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

    const list = $(".itemDetail-cat");
    const items = list.find("li");

    const additionalDetails = [...items].map((item) => [
      // https://stackoverflow.com/a/23956052
      $(item)
        .first()
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .replace(":", "")
        .trim(),
      $(item).find("span.label").text().trim(),
    ]);

    const rawData: { [k in keyof ThirdPartySchema]: unknown } = {};

    for (const [key, value] of additionalDetails) {
      const mappedKey = nxbtreAdditionalDetailsKeys[key];
      rawData[mappedKey] = value;
    }

    const image = $("#imgMain, #Content_ctl00_imgMain").attr("src");

    if (image)
      rawData.images = [
        joinURL("https://www.nxbtre.com.vn", image.replace("thumb", "full")),
      ];

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

const nxbtreAdditionalDetailsKeys: {
  [k: string]: keyof ThirdPartySchema;
} = {
  "Khổ sách": "size",
  "Số trang": "pageCount",
  "Trọng lượng": "weight",
  "Giá bán": "price",
  ISBN: "isbn",
  "Dịch giả": "translator",
  "Tác giả": "author",
};
