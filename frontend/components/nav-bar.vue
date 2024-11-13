<template>
  <header class="bg-black backdrop-blur-md py-4 px-6 fixed inset-x-0 top-0 z-50 shadow-lg">
    <div class="max-w-screen-xl mx-auto flex items-center justify-between">
      <!-- Logo Section -->
      <div class="flex items-center space-x-4">
        <NuxtImg
          src="/logo.png"
          alt="Logo"
          class="h-10 w-auto"
        />
        <NuxtLink to="/" class="text-white text-2xl font-extrabold tracking-wider">
          Pulse
        </NuxtLink>
      </div>
      
      <!-- Navigation Links (Desktop) -->
      <nav class="hidden md:flex space-x-6 text-white font-semibold tracking-wide">
        <NuxtLink to="/home" class="hover:text-blue transition duration-300">Home</NuxtLink>
        <NuxtLink to="/about" class="hover:text-blue transition duration-300">About</NuxtLink>
        <NuxtLink to="/services" class="hover:text-blue transition duration-300">Services</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-blue transition duration-300">Contact</NuxtLink>
      </nav>
      
      <!-- Dark Mode & Connect Button Wrapper (Desktop) -->
      <div class="hidden md:flex items-center space-x-4">
        <!-- Dark mode button -->
        <button
          @click="toggleDarkMode"
          class="dark-mode-toggle bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-400 dark:border-gray-600 p-2 rounded-full transition-colors duration-300 ease-in-out"
        >
          <span class="material-icons">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        </button>

        <!-- Connect Button -->
        <button class="btn-primary py-2 px-4 border border-blue text-white rounded-lg hover:bg-transparent hover:border-white transition-all duration-300">
          Connect
        </button>
      </div>


      <!-- Mobile Menu Toggle Button -->
      <div class="md:hidden flex items-center">
        <button @click="toggleMenu" class="text-white">
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
        class="md:hidden bg-black backdrop-blur-lg p-6 absolute top-16 left-0 right-0 z-40 shadow-lg"
      >
        <NuxtLink to="/" class="block text-white py-2 hover:text-blue">Home</NuxtLink>
        <NuxtLink to="/about" class="block text-white py-2 hover:text-blue">About</NuxtLink>
        <NuxtLink to="/services" class="block text-white py-2 hover:text-blue">Services</NuxtLink>
        <NuxtLink to="/contact" class="block text-white py-2 hover:text-blue">Contact</NuxtLink>
        <button
          class="w-full btn-primary py-2 mt-4 border border-blue text-white rounded-lg hover:bg-transparent hover:border-white transition-all duration-300"
        >
          Connect
        </button>
      </div>
    </transition>
  </header>
</template>


<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false); // Track dark mode state

// Function to toggle dark mode
const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

// Initialize dark mode based on saved preference or system preference
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

</style>
