<template>
  <div class="h-screen dark:bg-dark-bg flex items-center justify-center">
    <div id="container" class="bg-light-gray w-1/4 rounded-xl content-center p-5 h-auto shadow-xl hover:shadow-lg-white transition duration-300 relative">
      <form @submit.prevent="handleLogin">
        <!-- Dark Mode Toggle Button -->
        <div class="flex justify-end">
          <button
            @click="toggleDarkMode"
            class="dark-mode-toggle bg-gray-200 dark:bg-dark-gray text-gray-800 dark:text-dark-text border border-gray-400 dark:border-dark-light-gray p-2 rounded-full transition-colors duration-300 ease-in-out mb-4"
            aria-label="Toggle Dark Mode"
          >
            <span v-if="!isDark">🌞</span>
            <span v-else>🌙</span>
          </button>
        </div>

        <!-- Login Heading -->
        <h2 class="text-center text-black dark:text-dark-text text-h2 mb-8">Login</h2>

        <!-- Email Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="email" class="block text-black dark:text-dark-text mb-2">Email</label>
          <input
            v-model="formData.email"
            type="email"
            id="email"
            class="w-3/4 bg-transparent border-b-2 focus:placeholder:text-white dark:focus:placeholder:text-white border-black dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-black dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
            required
            placeholder="Enter your email"
          />
        </div>

        <!-- Password Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="password" class="block text-black dark:text-dark-text mb-2">Password</label>
          <input
            v-model="formData.password"
            type="password"
            id="password"
            class="w-3/4 bg-transparent border-b-2 focus:placeholder:text-white dark:focus:placeholder:text-white border-black dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-black dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
            required
            placeholder="Enter your password"
          />
        </div>

        <!-- Login Redirect -->
        <div class="flex flex-col items-center mb-4">
          <span class="text-black dark:text-dark-text">Don't have an account?
            <NuxtLink to="/auth/register" class="text-blue dark:text-dark-blue hover:text-light-blue dark:hover:text-blue transition duration-300">
              Register
            </NuxtLink>
          </span>
        </div>

        <!-- Login Button -->
        <div class="flex flex-col items-center mb-4">
          <button class="text-black dark:text-dark-text bg-blue dark:bg-dark-blue hover:bg-blue dark:hover:bg-blue transition duration-300 rounded px-4 py-2">
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useDarkMode } from '~/composables/useDarkMode';
const { isDark, toggleDarkMode } = useDarkMode();

const formData = ref({
  email: '',
  password: ''
});

async function handleLogin() {
  try {
    const response = await $fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST', 
      body: formData.value, 
    });

    console.log('Login successful:', response);
    alert('Login successful! Redirecting to home...');
    navigateTo('/nav/home'); 
  } catch (error) {
    console.error('Login error:', error);
    alert(error?.data?.message || 'An error occurred during login.');
  }
}


definePageMeta({
  layout: 'no-navbar'
});
</script>
