<template>
  <div class="h-screen dark:bg-dark-blue flex items-center justify-center">
    <div id="container" class="bg-black w-1/4 rounded-xl content-center p-5 h-auto shadow-xl hover:shadow-lg-white transition duration-300">
      <form @submit.prevent="handleLogin">
        <button
        @click="toggleDarkMode"
        class="absolute top-4 right-4 dark-mode-toggle bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-400 dark:border-gray-600 p-2 rounded-full transition-colors duration-300 ease-in-out"
        aria-label="Toggle Dark Mode"
      >
        <span v-if="!isDark">🌞</span>
        <span v-else>🌙</span>
      </button>
        <h2 class="text-center text-white dark:text-dark-text text-2xl mb-8">Login</h2>

        <!-- Email Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="email" class="block text-white dark:text-dark-text mb-2">Email</label>
          <input
            type="email"
            id="email"
            class="w-3/4 bg-transparent border-b-2 border-gray-400 dark:border-dark-light-gray text-black dark:text-dark-text focus:shadow-bottom-white focus:outline-none focus:border-white dark:focus:border-dark-blue placeholder-gray-400 focus:placeholder:text-white dark:placeholder-dark-light-gray py-2 transition duration-300"
            required
            placeholder="Enter your email"
          />
        </div>

        <!-- Password Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="password" class="block text-white dark:text-dark-text mb-2">Password</label>
          <input
            type="password"
            id="password"
            class="w-3/4 bg-transparent border-b-2 border-gray-400 dark:border-dark-light-gray text-black dark:text-dark-text focus:outline-none focus:shadow-bottom-white focus:border-white dark:focus:border-dark-blue placeholder-gray-400 focus:placeholder:text-white dark:placeholder-dark-light-gray py-2 transition duration-300"
            required
            placeholder="Enter your password"
          />
        </div>


        <!-- Login Redirect -->
        <div class="flex flex-col items-center mb-4">
          <span class="text-white dark:text-dark-text">Don't have an account?
            <NuxtLink to="/auth/register" class="text-blue dark:text-dark-blue hover:text-light-blue dark:hover:text-blue transition duration-300">
              Register
            </NuxtLink>
          </span>
        </div>
        <div class="flex flex-col items-center mb-4">
          <button class="text-white dark:text-dark-text bg-blue dark:bg-dark-blue hover:bg-blue dark:hover:bg-blue transition duration-300 rounded px-4 py-2">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const isDark = ref(false);

    const toggleDarkMode = () => {
      isDark.value = !isDark.value;
      document.documentElement.classList.toggle('dark', isDark.value);
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    };

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true;
        document.documentElement.classList.add('dark');
      }
    });

    return { isDark, toggleDarkMode };
  },
};
definePageMeta({
  layout: 'no-navbar'
});
</script>


<style>

</style>