import { z } from "zod";

export const thirdPartySchema = z.object({
  price: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.replace(/\D/g, "");
    }

    return val;
  }, z.coerce.number().optional()),
  sku: z.string().optional(),
  age: z.string().optional(),
  supplier: z.string().optional(),
  author: z.string().optional(),
  translator: z.string().optional(),
  publisher: z.string().optional(),
  language: z.string().optional(),
  isbn: z.string().optional(),
  weight: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.replace(/\D/g, "");
    }

    return val;
  }, z.coerce.number().optional()),
  size: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const [x, y, z] = val.replace("cm", "").replaceAll(",", ".").split("x");

        return { x, y, z };
      }

      return val;
    },
    z
      .object({
        x: z.coerce.number().optional(),
        y: z.coerce.number().optional(),
        z: z.coerce.number().optional(),
      })
      .optional(),
  ),
  pageCount: z.preprocess((val) => {
    if (typeof val === "string") {
      return val.replace(/\D/g, "");
    }

    return val;
  }, z.coerce.number().optional()),
  printType: z.string().optional(),
  images: z.array(z.string()).optional(),
  note: z.string().optional(),
});

export type ThirdPartySchema = z.output<typeof thirdPartySchema>;
