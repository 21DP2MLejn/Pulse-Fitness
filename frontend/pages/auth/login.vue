<template>
  <div class="h-screen flex items-center justify-center bg-white">
    <div class="">
      <form @submit.prevent="handleLogin">
        <h2 class="text-center text-black dark:text-dark-text">Login</h2>

        <!-- Email Input -->
        <div>
          <label for="email" class="block text-input-label text-black dark:text-dark-text">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="input-field"
            required
            placeholder="Enter your email"
          />
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-input-label text-black dark:text-dark-text">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="input-field"
            required
            placeholder="Enter your password"
            >
        </div>
    </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'no-navbar'
})


const handleLogin = () =>{

}

</script>

<style>

</style>