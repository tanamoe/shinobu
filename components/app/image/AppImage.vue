<script setup lang="ts">
import { joinURL, parseURL } from "ufo";
import type { MetadataImages } from "~/types/common";

const {
  public: { imageUrl },
} = useRuntimeConfig();

const props = defineProps<{
  src: string;
  srcset?: MetadataImages | null;
  loading?: HTMLImageElement["loading"];
  sizes?: HTMLImageElement["sizes"];
  draggable?: HTMLImageElement["draggable"];
}>();

const _src = computed(() =>
  !parseURL(props.src).host ? joinURL(imageUrl, props.src) : props.src,
);

const _srcset = computed(() => {
  if (props.srcset) {
    const ss: string[] = [];
    let src: keyof typeof props.srcset;

    for (src in props.srcset) {
      ss.push(joinURL(imageUrl, props.srcset[src]) + " " + src);
    }

    return ss.join(", ");
  }

  return undefined;
});
</script>

<template>
  <img
    :src="_src"
    :srcset="_srcset"
    :sizes
    :draggable
    :loading="loading ?? 'lazy'"
  />
</template>
