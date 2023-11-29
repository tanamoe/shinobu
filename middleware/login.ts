export default defineNuxtRouteMiddleware(() => {
  const { $pb } = useNuxtApp();

  if ($pb.authStore.isAdmin) {
    return navigateTo("/");
  }
});
