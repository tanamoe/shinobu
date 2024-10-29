<script setup lang="ts">
import { parse } from "@std/csv/parse";
import { Collections, type ReleasesResponse } from "~/types/pb";

const { $pb } = useNuxtApp();
const _publication = usePublication();
const _book = useBook();

const file = ref<File>();
const error = ref("");
const content = ref<
  {
    release: string;
    volume: number;
    name: string;
    edition: string;
    price: number;
    date: string;
    normalise: {
      release: string | null;
      publication: string;
    };
  }[]
>([]);
const releases = ref<{ name: string; release?: ReleasesResponse }[]>([]);

const group = computed(() => Object.groupBy(content.value, (c) => c.date));

const disabled = computed(() => {
  const count = releases.value.reduce((a, v) => {
    if (!v.release) a++;
    return a;
  }, 0);

  return count > 0 ? true : false;
});

function match(name: string, release?: ReleasesResponse) {
  if (release)
    for (const book of content.value) {
      if (book.release === name) {
        book.normalise.release = release.id;
      }
    }
}

async function autoMatch() {
  for (const _release of releases.value) {
    try {
      const release = await $pb
        .collection(Collections.Releases)
        .getFirstListItem($pb.filter("name ~ {:q}", { q: _release.name }));

      _release.release = release;
    } catch (e: unknown) {
      console.error(e);
      continue;
    }
  }
}

async function update() {
  if (file.value?.type != "text/csv") {
    error.value = "Invalid file type, got: " + file.value?.type;
    return;
  }
  const text = await file.value.text();

  const _content = parse(text, {
    columns: ["release", "volume", "name", "edition", "price", "date"],
  });

  content.value = _content.map((c) => {
    const _volume = c.volume.split(".");
    let volume = parseInt(_volume[0]) * 10000;
    if (_volume[1]) volume += parseInt(_volume[1]);

    return {
      ...c,
      volume,
      price: parseInt(c.price),
      date: c.date.replaceAll("/", "-"),
      normalise: {
        release: null,
        publication: `${c.release} ${volume}`,
      },
    };
  });

  releases.value = _content.reduce(
    (a, c) =>
      a.find((r) => r.name === c.release) !== undefined
        ? a
        : [...a, { name: c.release }],
    [] as { name: string; release?: ReleasesResponse }[],
  );

  error.value = "";
}
const publications = computed(() =>
  Object.groupBy(content.value, (c) => c.normalise.publication),
);

async function submit() {
  for (const [_, books] of Object.entries(publications.value)) {
    if (!books) continue;
    const release = releases.value.find(
      (r) => r.name === books[0].release,
    )?.release;
    const volume = books[0].volume;
    let volumeName = (volume / 10000).toString();
    if (volume % 10000 > 0) {
      volumeName += `.${volume % 10000}`;
    }
    const publicationResponse = await _publication.create({
      name: `${release?.name} - Tập ${volumeName}`,
      volume: volume,
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

    <InputFileDrop v-model="file" @change="update" />

    <div v-if="!error && content.length > 0" class="mt-6">
      <div v-if="releases" class="space-y-3 mb-6">
        <div class="flex items-center justify-between">
          <h2 class="text-gray-700 dark:text-gray-200 text-xl">
            Release matching
          </h2>
          <UButton @click="autoMatch">Auto</UButton>
        </div>
        <div
          class="grid grid-cols-[minmax(0,_1fr)_auto_minmax(0,_1fr)] gap-3 items-center justify-center"
        >
          <template v-for="({ name, release }, i) of releases" :key="name">
            <div v-if="!release">
              {{ name }}
            </div>
            <NuxtLink
              v-else
              :to="`/title/${release.title}/${release.id}`"
              class="underline decoration-gray-700 hover:decoration-sky-700 decoration-2 transition-colors"
            >
              {{ name }}
            </NuxtLink>
            <UIcon name="i-fluent-arrow-right-20-filled" class="h-4 w-4" />
            <InputRelease
              v-model="releases[i].release"
              @change="match(releases[i].name, releases[i].release)"
            />
          </template>
        </div>
      </div>

      <div v-if="group" class="space-y-3 mb-6">
        <div v-for="(books, i) in group" :key="i">
          <template v-if="books">
            <h2 class="text-gray-700 dark:text-gray-200 text-xl">
              {{ books.at(0)?.date }}
            </h2>
            <UTable :rows="books">
              <template #name-data="{ row }">
                <UInput v-model="row.name" />
              </template>
              <template #edition-data="{ row }">
                <UInput v-model="row.edition" />
              </template>
            </UTable>
          </template>
        </div>
      </div>

      <UButton block :disabled @click="submit">Submit</UButton>
    </div>

    <div v-else>
      {{ error }}
    </div>
  </div>
</template>
