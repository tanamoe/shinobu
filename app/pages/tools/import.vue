<script setup lang="ts">
import * as z from "zod";
import {
  Collections,
  type ReleasesResponse,
  type FormatsResponse,
  type PublishersResponse,
  type TitlesResponse,
} from "~/types/pb";
import type { FormSubmitEvent } from "@nuxt/ui";

const { $pb } = useNuxtApp();
const toast = useToast();
const _publication = usePublication();
const _book = useBook();

const file = ref<File>();

const bookSchema = z.object({
  release: z.string(),
  volume: z.number(),
  name: z.string(),
  edition: z.string(),
  price: z.number(),
  date: z.string(),
  normalise: z.object({
    release: z.string().min(1),
    publication: z.string(),
  }),
});

type BookSchema = z.output<typeof bookSchema>;

const releaseSchema = z.object({
  name: z.string(),
  release: z.any(),
});

type ReleaseSchema = z.output<typeof releaseSchema>;

const state = ref<
  Partial<{ books: Partial<BookSchema>[]; releases: Partial<ReleaseSchema>[] }>
>({
  books: [],
  releases: [],
});

async function update() {
  if (file.value?.type != "text/csv") {
    toast.add({
      title: "Invalid file type",
      description: "Only CSV files are accepted",
      color: "error",
    });
    return;
  }
  const text = await file.value.text();

  const [err, value] = csvBookImport(text);

  if (err != null) {
    toast.add({
      title: "Unexpected error",
      description: err.toString(),
      color: "error",
    });
    return;
  }

  state.value.books = value[0].map((c) => ({
    ...c,
    normalise: {
      release: "",
      publication: `${c.release} ${c.volume}`,
    },
  }));

  state.value.releases = await Promise.all(
    structuredClone(value[1]).map(async (release) => {
      try {
        const result = await $pb
          .collection(Collections.Releases)
          .getFirstListItem<
            ReleasesResponse<{
              publisher: PublishersResponse;
              partner: PublishersResponse;
              title: TitlesResponse<
                unknown,
                {
                  format: FormatsResponse;
                }
              >;
            }>
          >($pb.filter('name ~ {:q} && digital = false && status = "ON_GOING"', { q: release.name }));

        return {
          name: release.name,
          release: result,
        };
      } catch (err: unknown) {
        toast.add({
          title: "Unexpected error",
          description: `${err}`,
          color: "error",
        });
        return release;
      }
    }),
  );

  match();
}

function match() {
  if (!state.value.releases || !state.value.books) {
    return;
  }

  for (const { name, release } of state.value.releases) {
    for (const book of state.value.books) {
      if (book.release === name && release && !book.normalise?.release) {
        book.normalise!.release = release?.id ?? null;

        if (book.volume != 0 || book.volume < 90000000) {
          let volumeName = (book.volume! / 10000).toString();
          if (book.volume! % 10000 > 0) {
            volumeName += `.${book.volume! % 10000}`;
          }

          book.name = `${release?.name} - Tập ${volumeName}`;
        } else {
          book.name = release?.name;
        }
      }
    }
  }
}

async function onSubmit(
  event: FormSubmitEvent<{
    books: Partial<BookSchema>[];
    releases: Partial<ReleaseSchema>[];
  }>,
) {
  const publications = Object.groupBy(
    event.data.books,
    (c) => c.normalise!.publication,
  );

  for (const [_, books] of Object.entries(publications)) {
    if (!books) continue;
    const release = event.data.releases.find(
      (r) => r.name === books[0]?.release,
    )?.release;
    const publicationResponse = await _publication.create({
      name: books[0]?.name,
      volume: books[0]?.volume,
      release: release?.id,
    });

    if (publicationResponse) {
      for (const [_, book] of books.entries()) {
        await _book.create({
          edition: book.edition,
          publishDate: book.date,
          price: book.price,
          publication: publicationResponse.id,
        });
      }
    }
  }
}
</script>

<template>
  <div class="p-6 max-h-screen overflow-auto">
    <UBreadcrumb
      class="mb-6"
      :links="[
        {
          label: 'Import',
          to: '/tools/import',
          icon: 'i-fluent-arrow-import-20-filled',
        },
      ]"
    />

    <UFileUpload
      v-model="file"
      label="Upload import file"
      description="CSV (max. 2MB)"
      class="w-full min-h-32"
      accept="text/csv"
      required
      @change="update"
    />

    <div class="mt-6">
      <div class="space-y-3 mb-6">
        <UForm :state class="w-full space-y-3" @submit="onSubmit">
          <div class="flex items-center justify-between">
            <h2 class="text-gray-700 dark:text-gray-200 text-xl">
              Release matching
            </h2>
          </div>

          <UForm
            v-for="release in state.releases"
            :key="release.name"
            :state="release"
            :schema="releaseSchema"
            attach
            class="w-full grid grid-cols-[minmax(0,_1fr)_auto_minmax(0,_1fr)] gap-3 items-center justify-center"
          >
            <UFormField name="name">
              <UInput
                v-model="release.name"
                placeholder="Wonka Industries"
                disabled
                class="w-full"
              />
            </UFormField>

            <UIcon name="i-fluent-arrow-right-20-filled" class="h-4 w-4" />

            <UFormField name="release">
              <InputRelease
                v-model="release.release"
                class="w-full"
                @change="match"
              />
            </UFormField>
          </UForm>

          <UForm
            v-for="(book, i) in state.books"
            :key="i"
            :state="book"
            :schema="bookSchema"
            attach
            class="mb-6"
          >
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-3">
                <UFormField label="Name" name="name">
                  <UInput v-model="book.name" class="w-full" />
                </UFormField>

                <UFormField label="Edition" name="edition">
                  <UInput v-model="book.edition" class="w-full" />
                </UFormField>
              </div>

              <pre><code>{{ book }}</code></pre>
            </div>
          </UForm>

          <UButton block type="submit">Submit</UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>
