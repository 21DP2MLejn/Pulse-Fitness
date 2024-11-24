<template>
  <div class="h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
    <div id="container" class="relative bg-black dark:bg-dark-gray w-1/4 h-auto rounded-xl p-5 shadow-xl hover:shadow-lg-white transition duration-300">
      <!-- Dark Mode Toggle Button -->

      <!-- Form Content -->
      <form @submit.prevent="handleRegister">
        <button
        @click="toggleDarkMode"
        class="absolute top-4 right-4 dark-mode-toggle bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-400  dark:border-gray-600 p-2 rounded-full transition-colors duration-300 ease-in-out"
        aria-label="Toggle Dark Mode"
      >
        <span v-if="!isDark">🌞</span>
        <span v-else>🌙</span>
      </button>
        <h2 class="text-center text-white dark:text-dark-text text-2xl mb-8">Register</h2>

        <!-- Email Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="email" class="block text-white dark:text-dark-text mb-2">Email</label>
          <input
            type="email"
            id="email"
            class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
            required
            placeholder="Enter your email"
          />
        </div>

        <!-- Name Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="name" class="block text-white dark:text-dark-text mb-2">Name</label>
          <input
            type="text"
            id="name"
            class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
            required
            placeholder="Enter your name"
          />
        </div>

        <!-- Last Name Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="lastname" class="block text-white dark:text-dark-text mb-2">Last Name</label>
          <input
            type="text"
            id="lastname"
            class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
            required
            placeholder="Enter your last name"
          />
        </div>

        <!-- Password Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="password" class="block text-white dark:text-dark-text mb-2">Password</label>
          <input
            type="password"
            id="password"
            class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
            required
            placeholder="Enter your password"
          />
        </div>

        <!-- Password Confirmation Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="password_confirmation" class="block text-white dark:text-dark-text mb-2">Password Confirmation</label>
          <input
            type="password"
            id="password_confirmation"
            class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
            required
            placeholder="Confirm your password"
          />
        </div>

        <!-- Login Link and Register Button -->
        <div class="flex flex-col items-center mb-4">
          <span class="text-white dark:text-dark-text">Already have an account? 
            <NuxtLink to="/auth/login" class="text-blue dark:text-dark-blue hover:text-blue dark:hover:text-blue transition duration-300">Login</NuxtLink>
          </span>
        </div>

        <div class="flex flex-col items-center mb-4">
          <button class="text-white dark:text-dark-text bg-blue dark:bg-dark-blue hover:bg-blue dark:hover:bg-blue transition duration-300 rounded px-4 py-2">
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useDarkMode } from '~/composables/useDarkMode';

const { isDark, toggleDarkMode } = useDarkMode();

definePageMeta({
  layout: 'no-navbar'
});
</script>
