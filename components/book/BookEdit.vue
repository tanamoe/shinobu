<script setup lang="ts">
import slug from "slug";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type {
  BooksResponse,
  AssetsResponse,
  BookMetadataResponse,
  PublicationsResponse,
} from "@/types/pb";

const { pending, update, remove } = useBook();
const { update: updateP } = usePublication();
const asset = useAsset();
const bookMetadata = useBookMetadata();

const props = defineProps<{
  publication: PublicationsResponse;
  book: BooksResponse<
    unknown,
    {
      assets_via_book?: AssetsResponse[];
      bookMetadata_via_book?: BookMetadataResponse;
    }
  >;
}>();

const emit = defineEmits<{
  change: [];
}>();

const isDefault = computed(
  () => props.publication.defaultBook === props.book.id,
);

const schema = z.object({
  edition: z.string().optional(),
  publishDate: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  note: z.string().optional(),
  assets: z.array(
    z.object({
      file: z.instanceof(File),
      type: z.string(),
      preview: z.string(),
    }),
  ),
  "assets-": z.array(z.string()),
  bookMetadata: z.object({
    isbn: z.string().optional(),
    fahasaSKU: z.string().optional(),
    sizeX: z.coerce.number().optional(),
    sizeY: z.coerce.number().optional(),
    sizeZ: z.coerce.number().optional(),
    pageCount: z.coerce.number().optional(),
    weight: z.coerce.number().optional(),
  }),
});

type Schema = z.output<typeof schema>;

const fahasaURL = ref("");
const state = ref<Schema>({
  edition: props.book.edition,
  publishDate: props.book.publishDate,
  price: props.book.price,
  note: props.book.note,
  bookMetadata: {
    isbn: props.book.expand?.bookMetadata_via_book?.isbn,
    fahasaSKU: props.book.expand?.bookMetadata_via_book?.fahasaSKU,
    sizeX: props.book.expand?.bookMetadata_via_book?.sizeX,
    sizeY: props.book.expand?.bookMetadata_via_book?.sizeY,
    sizeZ: props.book.expand?.bookMetadata_via_book?.sizeZ,
    pageCount: props.book.expand?.bookMetadata_via_book?.pageCount,
    weight: props.book.expand?.bookMetadata_via_book?.weight,
  },
  assets: [],
  "assets-": [],
});

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement | null;

  if (target?.files && state.value.assets) {
    state.value.assets = state.value.assets.concat(
      [...target.files].map((file) => ({
        file: new File(
          [file],
          slug(props.publication.name || "") +
            "." +
            file.name.split(".").at(-1),
          {
            type: file.type,
          },
        ),
        type: "",
        preview: URL.createObjectURL(file),
      })),
    );

    // reset on update
    target.value = "";
  }
}

function handleFileRemove(i: number) {
  state.value.assets.splice(i, 1);
}

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  const res = await update(props.book.id, event.data);

  console.log(event.data);

  if (res) {
    const assetCount = props.book.expand?.assets_via_book?.length;

    for (const [i, image] of event.data.assets.entries()) {
      await asset.create({
        book: res.id,
        image: image.file,
        type: image.type,
        priority: (assetCount ?? 0) + 1 + i,
      });
    }

    for (const image of event.data["assets-"]) {
      await asset.remove(image);
    }

    if (props.book.expand?.bookMetadata_via_book?.id) {
      await bookMetadata.update(
        props.book.expand.bookMetadata_via_book.id,
        event.data.bookMetadata,
      );
    } else {
      await bookMetadata.create({
        book: res.id,
        ...event.data.bookMetadata,
      });
    }

    emit("change");
  }
}

async function handleDefault() {
  const res = await updateP(props.publication.id, {
    defaultBook: props.book.id,
  });

  if (res) {
    emit("change");
  }
}

async function handleRemove() {
  const res = await remove(props.book.id);

  if (res) {
    if (props.book.expand?.assets_via_book) {
      for (const image of props.book.expand.assets_via_book) {
        await asset.remove(image.id);
      }
    }
    emit("change");
  }
}

async function handleFahasa() {
  const [data, err] = await fetchFahasa(fahasaURL.value);

  console.log(err);

  const definedProps = (obj: { [s: string]: unknown }) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v));

  if (!err) {
    const fahasa = {
      price: data.price,
      assets: state.value.assets.concat(
        data.images
          ? data.images.map((image) => ({
              file: new File(
                [image],
                slug(props.publication.name || "") +
                  "." +
                  image.name.split(".").at(-1),
                {
                  type: image.type,
                },
              ),
              type: "",
              preview: URL.createObjectURL(image),
            }))
          : [],
      ),
      bookMetadata: {
        ...state.value.bookMetadata,
        fahasaSKU: data.sku,
        sizeX: data.size?.x,
        sizeY: data.size?.y,
        sizeZ: data.size?.z,
        pageCount: data.pageCount,
        weight: data.weight,
      },
    };

    state.value = Object.assign(state.value, definedProps(fahasa));
  }
}

function parseSize() {
  if (
    state.value.bookMetadata.sizeX &&
    state.value.bookMetadata.sizeX.toString().includes("x")
  ) {
    const _sizes = state.value.bookMetadata.sizeX.toString().split("x");

    state.value.bookMetadata = {
      ...state.value.bookMetadata,
      sizeX: parseFloat(_sizes[0]) || 0,
      sizeY: parseFloat(_sizes[1]) || 0,
      sizeZ: parseFloat(_sizes[2]) || 0,
    };
  }
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="isDefault" class="text-right">
      <UBadge>Default</UBadge>
    </div>
    <div class="flex gap-3">
      <UInput v-model="fahasaURL" class="flex-1" placeholder="FAHASA URL" />
      <UButton
        icon="i-fluent-sparkle-20-filled"
        color="gray"
        @click="handleFahasa"
      />
    </div>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-6"
      @submit="handleSubmit"
    >
      <UFormGroup label="Edition" name="edition">
        <UInput v-model="state.edition" />
      </UFormGroup>
      <UFormGroup label="Publish date" name="publishDate">
        <UInput v-model="state.publishDate" type="date" />
      </UFormGroup>
      <UFormGroup label="Price" name="price">
        <UInput v-model="state.price" type="number">
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs">VND</span>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup label="Note" name="note">
        <UTextarea v-model="state.note" />
      </UFormGroup>

      <UFormGroup label="Assets" name="assets">
        <div class="space-y-3">
          <AppAssetsList
            v-if="book.expand?.assets_via_book"
            v-model:remove-files="state['assets-']"
            :assets="book.expand.assets_via_book"
          />
          <div class="flex space-x-3 max-w-full overflow-x-auto">
            <div
              v-for="(a, i) in state.assets"
              :key="a.file.name"
              class="space-y-3 min-w-32"
            >
              <div class="relative">
                <UButton
                  class="absolute top-1 right-1"
                  variant="ghost"
                  size="2xs"
                  icon="i-fluent-delete-20-filled"
                  color="red"
                  @click="handleFileRemove(i)"
                />
                <img
                  :src="a.preview"
                  class="rounded w-32 object-contain aspect-[2/3] bg-gray-200 dark:bg-gray-800"
                />
              </div>
              <InputAssetTypes v-model="a.type" />
            </div>
          </div>
          <input
            class="mt-3"
            type="file"
            multiple
            ref="inputForm"
            @change="handleFileChange"
          />
        </div>
      </UFormGroup>

      <UFormGroup label="ISBN" name="bookMetadata.isbn">
        <UInput v-model="state.bookMetadata.isbn" />
      </UFormGroup>
      <UFormGroup label="FAHASA SKU" name="bookMetadata.fahasaSKU">
        <UInput v-model="state.bookMetadata.fahasaSKU" />
      </UFormGroup>

      <div class="grid grid-cols-3 gap-6">
        <UFormGroup label="X" name="bookMetadata.sizeX">
          <UInput v-model="state.bookMetadata.sizeX" @change="parseSize">
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">cm</span>
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup label="Y" name="bookMetadata.sizeY">
          <UInput v-model="state.bookMetadata.sizeY">
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">cm</span>
            </template>
          </UInput>
        </UFormGroup>
        <UFormGroup label="Z" name="bookMetadata.sizeZ">
          <UInput v-model="state.bookMetadata.sizeZ">
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">cm</span>
            </template>
          </UInput>
        </UFormGroup>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <UFormGroup label="Page Count" name="bookMetadata.pageCount">
          <UInput v-model="state.bookMetadata.pageCount" />
        </UFormGroup>
        <UFormGroup label="Weight" name="bookMetadata.weight">
          <UInput v-model="state.bookMetadata.weight">
            <template #trailing>
              <span class="text-gray-500 dark:text-gray-400 text-xs">g</span>
            </template>
          </UInput>
        </UFormGroup>
      </div>

      <div class="flex justify-between gap-3">
        <UButton
          label="Set Default"
          :pending="pending"
          variant="ghost"
          color="gray"
          :disabled="isDefault"
          @click="handleDefault"
        />

        <div class="space-x-3">
          <UButton
            label="Delete"
            :pending="pending"
            variant="ghost"
            color="red"
            @click="handleRemove"
          />
          <UButton label="Save" :pending="pending" type="submit" />
        </div>
      </div>
    </UForm>
  </div>
</template>
