<script setup lang="ts">
import slug from "slug";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type {
  BooksResponse,
  AssetsResponse,
  BookMetadataResponse,
} from "@/types/pb";

const { pending, update, remove } = useBook();
const asset = useAsset();
const bookMetadata = useBookMetadata();
const { publication } = useReleasePage();

const props = defineProps<{
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

const schema = z.object({
  edition: z.string().optional(),
  publishDate: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  note: z.string().optional(),
  assets: z
    .array(
      z.object({
        file: z.instanceof(File),
        type: z.string(),
        preview: z.string(),
      }),
    )
    .transform((assets) =>
      assets.map((asset) => ({
        ...asset,
        file: new File(
          [asset.file],
          slug(publication.value?.name || "") +
            "." +
            asset.file.name.split(".").at(-1),
          {
            type: asset.type,
          },
        ),
      })),
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
        file,
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

  if (res) {
    for (const image of event.data.assets) {
      await asset.create({
        book: res.id,
        image: image.file,
        type: image.type,
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
</script>

<template>
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
          :assets="book.expand.assets_via_book"
          v-model:remove-files="state['assets-']"
        />
        <div class="flex space-x-3 max-w-full overflow-x-auto">
          <div v-for="(asset, i) in state.assets" class="space-y-3">
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
                :src="asset.preview"
                class="w-24 aspect-[2/3] object-cover rounded"
              />
            </div>
            <InputAssetTypes v-model="asset.type" />
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
        <UInput v-model="state.bookMetadata.sizeX">
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

    <div class="text-right space-x-3">
      <UButton
        label="Delete"
        :pending="pending"
        variant="ghost"
        color="red"
        @click="handleRemove"
      />
      <UButton label="Save" :pending="pending" type="submit" />
    </div>
  </UForm>
</template>