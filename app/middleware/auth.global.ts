export default defineNuxtRouteMiddleware((to) => {
  const { $pb } = useNuxtApp();

  if (!$pb.authStore.isAdmin && to.path !== "/login") {
    return navigateTo("/login");
  }
});
