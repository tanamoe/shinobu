export default defineNuxtRouteMiddleware((to) => {
  const { $pb } = useNuxtApp();

  if (!$pb.authStore.isSuperuser && to.path !== "/login") {
    return navigateTo("/login");
  }
});
