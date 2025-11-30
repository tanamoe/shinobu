<script setup lang="ts">
const { $pb } = useNuxtApp();

$pb.authStore.clear();

await navigateTo("/login");
</script>
