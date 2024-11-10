<script setup lang="ts">
import slug from "slug";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type {
  BooksResponse,
  AssetsResponse,
  BookMetadataResponse,
  PublicationsResponse,
  AssetTypesResponse,
} from "@/types/pb";
import type { ThirdPartySchema } from "~/server/utils/common";
import type { MetadataImages } from "~/types/common";

const { pending, update, remove } = useBook();
const { update: updateP } = usePublication();
const asset = useAsset();
const bookMetadata = useBookMetadata();

const props = defineProps<{
  publication: PublicationsResponse;
  book: BooksResponse;
  assets?: AssetsResponse<MetadataImages, { type: AssetTypesResponse }>[];
  metadata?: BookMetadataResponse;
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

  console.log(event.data);

  if (res) {
    const assetCount = props.assets?.length;

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
    if (props.assets) {
      for (const image of props.assets) {
        await asset.remove(image.id);
      }
    }
    emit("change");
  }
}

async function handleThirdParty(response: ThirdPartySchema) {
  const definedProps = (obj: { [s: string]: unknown }) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v));

  const data = {
    price: response.price,
    note: response.note,
    bookMetadata: {
      ...state.value.bookMetadata,
      isbn: response.isbn,
      fahasaSKU: response.sku,
      sizeX: response.size?.x,
      sizeY: response.size?.y,
      sizeZ: response.size?.z,
      pageCount: response.pageCount,
      weight: response.weight,
    },
  };

  state.value = Object.assign(state.value, definedProps(data));

  if (response.images) {
    for (const src of response.images) {
      const { data } = await useFetch("/api/proxy", {
        query: {
          url: src,
        },
        transform: (image: Blob) => ({
          file: new File(
            [image],
            slug(props.publication.name) + "." + src.split(".").at(-1),
          ),
          description: "",
          type: "",
        }),
      });
      if (data.value) {
        state.value.assets.push(data.value);
      }
    }
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
  <div class="space-y-6">
    <div v-if="isDefault" class="text-right">
      <UBadge>Default</UBadge>
    </div>
    <BookEditThirdParty @change="handleThirdParty" />

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

      <UDivider />

      <UFormGroup label="ISBN" name="bookMetadata.isbn">
        <UInput v-model="state.bookMetadata.isbn" />
      </UFormGroup>
      <UFormGroup label="SKU" name="bookMetadata.fahasaSKU">
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

      <UDivider />

      <UFormGroup label="Assets" name="assets">
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
      </UFormGroup>

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
