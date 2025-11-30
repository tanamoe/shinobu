export default defineNuxtRouteMiddleware(() => {
  const { $pb } = useNuxtApp();

  if ($pb.authStore.isSuperuser) {
    return navigateTo("/");
  }
});
