<template>
  <div class="h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
    <div
      id="container"
      class="relative bg-black dark:bg-dark-gray w-1/4 h-auto rounded-xl p-5 shadow-xl hover:shadow-lg-white transition duration-300"
    >
      <button
        @click="toggleDarkMode"
        class="absolute top-4 right-4 dark-mode-toggle bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-400 dark:border-gray-600 p-2 rounded-full transition-colors duration-300 ease-in-out"
        aria-label="Toggle Dark Mode"
      >
        <span v-if="!isDark">🌞</span>
        <span v-else>🌙</span>
      </button>
      <h2 class="text-center text-white dark:text-dark-text text-2xl mb-8">Register</h2>
      
      <form @submit.prevent="handleRegister">
        <!-- Step 1 -->
        <div v-if="step === 1">
          <div class="flex flex-col items-center mb-4">
            <label for="email" class="block text-white dark:text-dark-text mb-2">Email</label>
            <input
              v-model="formData.email"
              type="email"
              id="email"
              class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
              required
              placeholder="Enter your email"
            />
          </div>

          <div class="flex flex-col items-center mb-4">
            <label for="name" class="block text-white dark:text-dark-text mb-2">Name</label>
            <input
              v-model="formData.name"
              type="text"
              id="name"
              class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
              required
              placeholder="Enter your name"
            />
          </div>

          <div class="flex flex-col items-center mb-4">
            <label for="lastname" class="block text-white dark:text-dark-text mb-2">Last Name</label>
            <input
              v-model="formData.lastname"
              type="text"
              id="lastname"
              class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
              required
              placeholder="Enter your last name"
            />
          </div>

          <div class="flex flex-col items-center mb-4">
            <label for="password" class="block text-white dark:text-dark-text mb-2">Password</label>
            <input
              v-model="formData.password"
              type="password"
              id="password"
              class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
              required
              placeholder="Enter your password"
            />
          </div>

          <div class="flex flex-col items-center mb-4">
            <label for="password_confirmation" class="block text-white dark:text-dark-text mb-2">Password Confirmation</label>
            <input
              v-model="formData.password_confirmation"
              type="password"
              id="password_confirmation"
              class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
              required
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <!-- Step 2 -->
        <div v-if="step === 2">
          <div class="flex flex-col items-center mb-4">
            <label for="birthdate" class="block text-white dark:text-dark-text mb-2">Birthdate</label>
            <input
              v-model="formData.birthdate"
              type="date"
              id="birthdate"
              class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
              placeholder="Enter your birthdate"
            />
          </div>

          <div class="flex flex-col items-center mb-4">
            <label for="gender" class="text-white dark:text-dark-text">Gender</label>
            <div class="flex items-center">
              <input v-model="formData.gender" type="radio" id="male" name="gender" value="male" class="mr-2" />
              <label for="male" class="text-white dark:text-dark-text">Male</label>
            </div>
            <div class="flex items-center">
              <input v-model="formData.gender" type="radio" id="female" name="gender" value="female" class="mr-2" />
              <label for="female" class="text-white dark:text-dark-text">Female</label>
            </div>
            <div class="flex items-center">
              <input v-model="formData.gender" type="radio" id="other" name="gender" value="other" class="mr-2" />
              <label for="other" class="text-white dark:text-dark-text">Other</label>
            </div>
          </div>

          <div class="flex flex-col items-center mb-4">
            <label for="phonenumber" class="block text-white dark:text-dark-text mb-2">Phone Number</label>
            <input
              v-model="formData.phone"
              type="tel"
              id="phonenumber"
              class="w-3/4 bg-transparent border-b-2 dark:focus:placeholder:text-white border-gray-400 dark:border-dark-light-gray text-white dark:text-dark-text focus:shadow-bottom-white dark:focus:shadow-bottom-dark-blue placeholder-gray-400 dark:placeholder-dark-light-gray focus:outline-none focus:border-white dark:focus:border-dark-blue py-2 transition duration-300"
              required
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6">
          <button
            v-if="step > 1"
            type="button"
            @click="step--"
            class="text-white dark:text-dark-text bg-gray-500 hover:bg-gray-700 dark:bg-dark-blue transition duration-300 rounded px-4 py-2"
          >
            Back
          </button>
          <button
            v-if="step === 1"
            type="button"
            @click="validateStep1"
            class="text-white dark:text-dark-text bg-blue dark:bg-dark-blue hover:bg-blue dark:hover:bg-blue transition duration-300 rounded px-4 py-2"
          >
            Next
          </button>
          <button
            v-if="step === 2"
            type="submit"
            class="text-white align-self-center dark:text-dark-text bg-blue dark:bg-dark-blue hover:bg-blue dark:hover:bg-blue transition duration-300 rounded px-4 py-2"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useDarkMode } from '~/composables/useDarkMode';
import { ref } from 'vue';

const { isDark, toggleDarkMode } = useDarkMode();
const step = ref(1);
const formData = ref({
  email: '',
  name: '',
  lastname: '',
  password: '',
  password_confirmation: '',
  birthdate: '',
  gender: '',
  phone: '',
});

function validateStep1() {
  if (!formData.value.email || !formData.value.name || !formData.value.lastname || !formData.value.password || !formData.value.password_confirmation) {
    alert('Please fill all fields');
    return;
  }
  if (formData.value.password !== formData.value.password_confirmation) {
    alert('Passwords do not match');
    return;
  }
  step.value++;
}

function handleRegister() {
  if (!formData.value.birthdate || !formData.value.gender || !formData.value.phone) {
    alert('Please fill all fields');
    return;
  }
  // Submit registration logic here
  console.log('Registering user:', formData.value);
  alert('Registration successful!');
}

definePageMeta({
  layout: 'no-navbar'
});
</script>
