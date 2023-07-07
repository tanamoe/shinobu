export default defineNuxtRouteMiddleware((to) => {
  const { $pb } = useNuxtApp();

  if ($pb.authStore.model === null && to.path !== "/login") {
    return navigateTo("/login");
  }
});
