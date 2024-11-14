<template>
  <div class="h-screen flex items-center justify-center">
    <div id="container" class="bg-black w-1/4 rounded-xl content-center p-5 h-auto shadow-xl">
      <form @submit.prevent="handleRegister">
        <h2 class="text-center text-white text-h2 dark:text-dark-text mb-8">Register</h2>
        <!-- Information Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="email" class="block text-input-label text-white dark:text-dark-text mb-2">Email</label>
          <input
            type="email"
            id="email"
            class="input-underline w-3/4 bg-transparent border-b-2 border-gray-400 text-white focus:outline-none focus:border-white  placeholder-gray-400 focus:placeholder:text-white py-2 focus:shadow-bottom-white transition duration-300 "
            required
            placeholder="Enter your email"
          />
        </div>
        <div class="flex flex-col items-center mb-4">
          <label for="email" class="block text-input-label text-white dark:text-dark-text mb-2">Name</label>
          <input
            type="name"
            id="name"
            class="input-underline w-3/4 bg-transparent border-b-2 border-gray-400 text-white focus:outline-none focus:border-white  placeholder-gray-400 focus:placeholder:text-white py-2 focus:shadow-bottom-white transition duration-300 "
            required
            placeholder="Enter your name"
          />
        </div>
        <div class="flex flex-col items-center mb-4">
          <label for="email" class="block text-input-label text-white dark:text-dark-text mb-2">Last Name</label>
          <input
            type="name"
            id="lastname"
            class="input-underline w-3/4 bg-transparent border-b-2 border-gray-400 text-white focus:outline-none focus:border-white  placeholder-gray-400 focus:placeholder:text-white py-2 focus:shadow-bottom-white transition duration-300 "
            required
            placeholder="Enter your last name"
          />
        </div>

        <!-- Password Input -->
        <div class="flex flex-col items-center mb-4">
          <label for="password" class="block text-input-label text-white dark:text-dark-text mb-2">Password</label>
          <input
            type="password"
            id="password"
            class="input-underline w-3/4 bg-transparent border-b-2 border-gray-400 text-white focus:outline-none focus:border-white  placeholder-gray-400 focus:placeholder:text-white py-2 focus:shadow-bottom-white transition duration-300 "
            required
            placeholder="Enter your password"
          />
        </div>
        <div class="flex flex-col items-center mb-4">
          <label for="password" class="block text-input-label text-white dark:text-dark-text mb-2">Password Confirmation</label>
          <input
            type="password"
            id="password_confirmation"
            class="input-underline w-3/4 bg-transparent border-b-2 border-gray-400 text-white focus:outline-none focus:border-white  placeholder-gray-400 focus:placeholder:text-white py-2 focus:shadow-bottom-white transition duration-300 "
            required
            placeholder="Confirm your password"
          />
        </div>
        <div class="flex flex-col items-center mb-4">
          <span class="text-white">Already have an account? <NuxtLink to="/auth/login" class="text-blue hover:text-light-blue transition duration-300 ">Login</NuxtLink></span>
        </div>
        <div class="flex flex-col items-center mb-4">
          <button class="text-white text-button btn-primary">
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: 'no-navbar',
})
</script>

<style>

</style>