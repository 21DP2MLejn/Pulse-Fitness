<template>
  <div class="DefaultLayout text-black h-screen">
    <NavBar />
    <p>Default layout</p>
    <LoadingScreen v-if="isLoading" />
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false
    };
  },
  watch: {
    // Watch for route changes to show/hide loading screen
    $route(to, from) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000); // Adjust time as needed
    }
  }
};
</script>

<style>

</style>