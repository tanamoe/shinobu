import { z } from "zod";
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
    const response = await fetch(url, {
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "user-agent": "HTTPie/3.2.4",
      },
      keepalive: true,
      method: "GET",
    });
    const body = await response.text();
    console.log("getting data for", body);
    const rawData = JSON.parse(body);
    const attributes = rawData.attributes as
      | Array<{ name: string; value: unknown }>
      | undefined;

    const unparsedData = {
      price: rawData.price ?? 0,
      sku: rawData.sku,
      weight: attributes?.find((v) => v.name == "weight")?.value || 0,
      size: attributes?.find((v) => v.name == "size")?.value || 0,
      pageCount: attributes?.find((v) => v.name == "qty_of_page")?.value || 0,
      images: rawData.media_gallery?.images?.map(
        (image: { file: string }) => image.file,
      ),
    };

    const data = thirdPartySchema.parse(unparsedData);
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
