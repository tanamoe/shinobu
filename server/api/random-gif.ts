type TenorReponseObject = {
  results: {
    created: number;
    id: string;
    media_formats: Record<
      "gif",
      {
        url: string;
        dims: number[];
        duration: number;
        size: number;
      }
    >;
    tags: string[];
    title: string;
    content_description: string;
    itemurl: string;
    url: string;
  }[];
};

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig();

  const response = await $fetch<TenorReponseObject>(
    "https://tenor.googleapis.com/v2/search",
    {
      params: {
        key: runtimeConfig.tenorApiKey,
        q: "kikuri",
        media_filter: "gif",
        random: true,
      },
    },
  );

  return {
    result: response.results[0].media_formats.gif.url,
  };
});
