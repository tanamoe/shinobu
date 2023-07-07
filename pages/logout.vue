<script setup lang="ts">
const { $pb } = useNuxtApp();

$pb.authStore.clear();

navigateTo("/login");
</script>
