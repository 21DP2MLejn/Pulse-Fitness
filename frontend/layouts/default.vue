<template>
  <div class="DefaultLayout text-black h-screen">
    <NavBar />
    <p>Default layout</p>
    <LoadingScreen v-if="isLoading" />
    <slot />
    <Footer />
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
    $route(to, from) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1200);
    }
  }
};
</script>

<style>

</style>