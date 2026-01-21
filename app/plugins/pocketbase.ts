import PocketBase, { type AuthModel } from "pocketbase";
import type { TypedPocketBase } from "@/types/pb";

import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { AggregateService } from "@buf/tanamoe_urano.bufbuild_es/urano/api/v1beta1/aggreegate_pb";

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig();

  const pb = new PocketBase(
    runtimeConfig.public.pocketbaseUrl,
  ) as TypedPocketBase;

  const urano = createClient(
    AggregateService,
    createConnectTransport({
      baseUrl: "http://localhost:8080",
    }),
  );

  const cookie = useCookie<{
    token: string;
    model: AuthModel;
  }>("pb_auth", {
    path: "/",
    secure: true,
    sameSite: "strict",
    httpOnly: false, // change to "true" if you want only server-side access
    maxAge: 604800,
  });

  // load the store data from the cookie value
  pb.authStore.save(cookie.value?.token, cookie.value?.model);

  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    cookie.value = {
      token: pb.authStore.token,
      model: pb.authStore.model,
    };
  });

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid && (await pb.collection("_superusers").authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    pb.authStore.clear();
  }

  return {
    provide: { pb, urano },
  };
});
