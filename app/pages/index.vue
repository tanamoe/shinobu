<script setup lang="ts">
import { Collections } from "~/types/pb";

const { $pb } = useNuxtApp();

const { data: titles } = await useAsyncData(() =>
  $pb.collection(Collections.Titles).getList(0, 0),
);

const { data: books } = await useAsyncData(() =>
  $pb.collection(Collections.Books).getList(0, 0),
);

const { data: users } = await useAsyncData(() =>
  $pb.collection(Collections.Users).getList(0, 0),
);
</script>

<template>
  <div class="flex items-center justify-center h-full">
    {{ titles?.totalItems }}
    {{ books?.totalItems }}
    {{ users?.totalItems }}
  </div>
</template>
