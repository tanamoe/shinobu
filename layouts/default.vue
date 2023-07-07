<template>
  <div class="absolute flex inset-0">
    <div>
      <AppSidebar />
    </div>
    <main class="overflow-y-scroll flex-1">
      <slot />
    </main>
  </div>
</template>
