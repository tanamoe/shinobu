import { z } from "zod";

const schema = z.object({
  url: z.string().url(),
});

export default defineEventHandler(async function (event) {
  const { data, error } = await getValidatedQuery(event, (body) =>
    schema.safeParse(body),
  );

  if (error) {
    return error;
  }

  const { url } = data;

  const response = await fetch(url);

  return await response.blob();
});
