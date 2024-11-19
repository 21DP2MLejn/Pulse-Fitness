<template>
  <header class="bg-white dark:bg-black backdrop-blur-md py-4 px-6 fixed inset-x-0 top-0 z-50 shadow-lg">
    <div class="max-w-screen-xl mx-auto flex items-center justify-between">
      <!-- Logo Section -->
      <div class="flex items-center space-x-4">
        <NuxtImg
          src="/logo.png"
          alt="Logo"
          class="h-10 w-auto"
        />
        <NuxtLink to="/" class="text-black dark:text-white text-2xl font-extrabold tracking-wider">
          Pulse
        </NuxtLink>
      </div>
      
      <!-- Navigation Links (Desktop) -->
      <nav class="hidden md:flex space-x-6 font-semibold tracking-wide">
        <NuxtLink to="/nav/home" class="text-black dark:text-white hover:text-blue dark:hover:text-light-blue transition duration-300">
          Home
        </NuxtLink>
        <NuxtLink to="/nav/subscriptions" class="text-black dark:text-white hover:text-blue dark:hover:text-light-blue transition duration-300">
          Subscriptions
        </NuxtLink>
        <NuxtLink to="/nav/products" class="text-black dark:text-white hover:text-blue dark:hover:text-light-blue transition duration-300">
          Products
        </NuxtLink>
        <NuxtLink to="/nav/about" class="text-black dark:text-white hover:text-blue dark:hover:text-light-blue transition duration-300">
          About
        </NuxtLink>
      </nav>
      
      <!-- Dark Mode & Connect Button Wrapper (Desktop) -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- Dark mode button -->
        <button
          @click="toggleDarkMode"
          class="dark-mode-toggle bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-400 dark:border-gray-600 p-2 rounded-full transition-colors duration-300 ease-in-out"
          aria-label="Toggle Dark Mode"
        >
          <span v-if="!isDark">🌞</span>
          <span v-else>🌙</span>
        </button>

        <!-- Connect Button -->
        <NuxtLink to="/auth/login">
          <button class="btn-primary py-2 px-4 border hover:text-black border-blue dark:border-dark-blue text-black dark:text-white bg-blue dark:bg-dark-blue rounded-lg hover:bg-transparent dark:hover:bg-transparent hover:border-black dark:hover:border-white transition-all duration-300">
            Connect
          </button>
        </NuxtLink>
      </div>

      <!-- Mobile Menu Toggle Button -->
      <div class="md:hidden flex items-center">
        <button @click="toggleMenu" class="text-black dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="fade">
      <div
        v-if="isMenuOpen"
        @click="toggleMenu"
        class="md:hidden bg-white dark:bg-black backdrop-blur-lg p-6 absolute top-16 left-0 right-0 z-40 shadow-lg"
      >
        <NuxtLink to="/" class="block text-black dark:text-white py-2 hover:text-blue dark:hover:text-light-blue">
          Home
        </NuxtLink>
        <NuxtLink to="/about" class="block text-black dark:text-white py-2 hover:text-blue dark:hover:text-light-blue">
          Subscriptions
        </NuxtLink>
        <NuxtLink to="/services" class="block text-black dark:text-white py-2 hover:text-blue dark:hover:text-light-blue">
          Products
        </NuxtLink>
        <NuxtLink to="/contact" class="block text-black dark:text-white py-2 hover:text-blue dark:hover:text-light-blue">
          About
        </NuxtLink>
        <button
          @click="toggleDarkMode"
          class="dark-mode-toggle bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-400 dark:border-gray-600 p-2 rounded-full transition-colors duration-300 ease-in-out"
          aria-label="Toggle Dark Mode"
        >
          <span v-if="!isDark">🌞</span>
          <span v-else>🌙</span>
        </button>
        <NuxtLink to="/auth/login">
          <button
            class="w-full btn-primary py-2 mt-4 border hover:text-black border-blue dark:border-dark-blue text-black dark:text-white bg-blue dark:bg-dark-blue rounded-lg hover:bg-transparent dark:hover:bg-transparent hover:border-black dark:hover:border-white transition-all duration-300"
          >
            Connect
          </button>
        </NuxtLink>
      </div>
    </transition>
  </header>
</template>


<script setup>
import { useDarkMode } from '~/composables/useDarkMode';

const { isDark, toggleDarkMode } = useDarkMode();


import { ref } from 'vue';

const isMenuOpen = ref(false); 

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value; 
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

</style>
