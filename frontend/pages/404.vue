<script setup>
useHead(() => ({
 status: 404,
 title: "Page not found",
}));
</script>

<template>
  <NuxtLayout>
    <div class="flex items-center justify-center min-h-screen bg-dark-blue text-white p-6">
      <div class="text-center max-w-md w-full">
        <h1 class="text-9xl font-bold text-blue mb-6">
          404
        </h1>
        <p class="text-2xl mb-4 text-light-gray">
          Oops! The page you're looking for can't be found.
        </p>
        <p class="text-lg text-light-gray mb-8">
          It might have been removed or you may have mistyped the address.
        </p>
        <NuxtLink
          to="/"
          class="px-8 py-3 bg-blue text-white rounded-lg hover:bg-dark-blue transition-colors duration-300"
        >
          Go Back Home
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
