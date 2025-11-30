<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type {
  BooksResponse,
  AssetsResponse,
  BookMetadataResponse,
  PublicationsResponse,
  AssetTypesResponse,
} from "@/types/pb";
import type { MetadataImages } from "@/types/common";

const { pending, update, remove } = useBook();
const { create, remove: assetRemove } = useAsset();
const bookMetadata = useBookMetadata();

const props = defineProps<{
  publication: PublicationsResponse;
  book: BooksResponse;
  assets?: AssetsResponse<MetadataImages, { type: AssetTypesResponse }>[];
  metadata?: BookMetadataResponse;
  button?: boolean;
}>();

const emit = defineEmits<{
  change: [];
}>();

const schema = z.object({
  edition: z.string().optional(),
  publishDate: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  note: z.string().optional(),
  assets: z.array(
    z.object({
      file: z.instanceof(File),
      description: z.string(),
      type: z.string(),
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

const state = ref<Schema>({
  edition: props.book.edition,
  publishDate: props.book.publishDate.split(" ")[0],
  price: props.book.price,
  note: props.book.note,
  bookMetadata: {
    isbn: props.metadata?.isbn,
    fahasaSKU: props.metadata?.fahasaSKU,
    sizeX: props.metadata?.sizeX,
    sizeY: props.metadata?.sizeY,
    sizeZ: props.metadata?.sizeZ,
    pageCount: props.metadata?.pageCount,
    weight: props.metadata?.weight,
  },
  assets: [],
  "assets-": [],
});

async function handleSubmit(event: FormSubmitEvent<Schema>) {
  const res = await update(props.book.id, event.data);

  if (res) {
    const assetCount = props.assets?.length;

    for (const [i, image] of event.data.assets.entries()) {
      await create({
        book: res.id,
        image: image.file,
        type: image.type,
        priority: (assetCount ?? 0) + 1 + i,
      });
    }

    for (const image of event.data["assets-"]) {
      await assetRemove(image);
    }

    if (props.metadata?.id) {
      await bookMetadata.update(props.metadata.id, event.data.bookMetadata);
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
    if (props.assets) {
      for (const image of props.assets) {
        await remove(image.id);
      }
    }
    emit("change");
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
      sizeX: parseFloat(_sizes[0] ?? "0") || 0,
      sizeY: parseFloat(_sizes[1] ?? "0") || 0,
      sizeZ: parseFloat(_sizes[2] ?? "0") || 0,
    };
  }
}

function toggleAsset(asset: AssetsResponse) {
  if (state.value["assets-"].includes(asset.id)) {
    state.value["assets-"] = state.value["assets-"].filter(
      (f) => f !== asset.id,
    );
  } else {
    state.value["assets-"].push(asset.id);
  }
}
</script>

<template>
  <UForm :schema :state class="space-y-6" @submit="handleSubmit">
    <UFormField label="Edition" name="edition">
      <UInput v-model="state.edition" class="w-full" />
    </UFormField>

    <UFormField label="Publish date" name="publishDate">
      <UInput v-model="state.publishDate" type="date" class="w-full" />
    </UFormField>

    <UFormField label="Price" name="price">
      <UInput v-model="state.price" type="number" class="w-full">
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">VND</span>
        </template>
      </UInput>
    </UFormField>

    <UFormField label="Note" name="note">
      <UTextarea v-model="state.note" class="w-full" />
    </UFormField>

    <UFormField label="ISBN" name="bookMetadata.isbn">
      <UInput v-model="state.bookMetadata.isbn" class="w-full" />
    </UFormField>
    <UFormField label="SKU" name="bookMetadata.fahasaSKU">
      <UInput v-model="state.bookMetadata.fahasaSKU" class="w-full" />
    </UFormField>

    <div class="grid grid-cols-3 gap-6">
      <UFormField label="X" name="bookMetadata.sizeX">
        <UInput v-model="state.bookMetadata.sizeX" @change="parseSize">
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs">cm</span>
          </template>
        </UInput>
      </UFormField>
      <UFormField label="Y" name="bookMetadata.sizeY">
        <UInput v-model="state.bookMetadata.sizeY">
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs">cm</span>
          </template>
        </UInput>
      </UFormField>
      <UFormField label="Z" name="bookMetadata.sizeZ">
        <UInput v-model="state.bookMetadata.sizeZ">
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs">cm</span>
          </template>
        </UInput>
      </UFormField>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <UFormField label="Page Count" name="bookMetadata.pageCount">
        <UInput v-model="state.bookMetadata.pageCount" />
      </UFormField>
      <UFormField label="Weight" name="bookMetadata.weight">
        <UInput v-model="state.bookMetadata.weight">
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs">g</span>
          </template>
        </UInput>
      </UFormField>
    </div>

    <UFormField label="Assets" name="assets">
      <div class="space-y-3">
        <div v-if="assets" class="space-y-3">
          <AppAsset
            v-for="asset in assets"
            :key="asset.id"
            :asset
            :type="asset.expand?.type"
            :strikethrough="state['assets-'].includes(asset.id)"
            @toggle="toggleAsset"
          />
        </div>

        <InputAsset v-model="state.assets" multiple />
      </div>
    </UFormField>

    <div class="flex justify-between gap-3">
      <div class="space-x-3">
        <UButton
          label="Delete"
          :pending="pending"
          variant="ghost"
          color="error"
          @click="handleRemove"
        />
        <UButton label="Save" :pending="pending" type="submit" />
      </div>
    </div>
  </UForm>
</template>
