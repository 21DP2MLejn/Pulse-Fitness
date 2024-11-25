<template>
  <div class="dark:bg-dark-bg bg-white ">
    <!-- Hero Section -->
    <section class="hero flex flex-col items-center justify-center h-screen p-8 text-center dark:text-white text-black">
      <h1 class="text-4xl font-bold mb-4">Welcome to Our Gym</h1>
      <p class="text-lg mb-8">Achieve your fitness goals with us</p>

      <Slider />

      <!-- Call to Action -->
      <div class="cta mt-8">
        <button class="btn-primary py-2 px-4 border hover:text-black border-blue dark:border-dark-blue text-black dark:text-white bg-blue dark:bg-dark-blue rounded-lg hover:bg-transparent dark:hover:bg-transparent hover:border-black dark:hover:border-white transition-all duration-300">
          Get Started
        </button>
      </div>
    </section>

    <!-- Services Section -->
    <section class="features p-8 dark:bg-dark-bg bg-gray-100">
      <h2 class="text-h2 text-center mb-6 text-black dark:text-dark-text">Our Services</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="feature-box dark:text-white p-6 bg-white rounded-xl shadow-md text-center dark:bg-dark-gray">
          <h3 class="text-xl font-semibold mb-4">Personal Training</h3>
          <p>One-on-one coaching to help you reach your fitness goals faster.</p>
        </div>
        <div class="feature-box dark:text-white p-6 bg-white dark:bg-dark-gray rounded-xl shadow-md text-center">
          <h3 class="text-xl font-semibold mb-4">Group Classes</h3>
          <p>Join group fitness classes for a fun and motivating workout.</p>
        </div>
        <div class="feature-box dark:text-white p-6 bg-white dark:bg-dark-gray rounded-xl shadow-md text-center">
          <h3 class="text-xl font-semibold mb-4">Nutrition Plans</h3>
          <p>Customized nutrition plans to complement your workout routine.</p>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="products p-8 bg-gray-100 dark:bg-dark-bg" >
      <h2 class="text-h2 text-center mb-6 text-black dark:text-dark-text" >Our Products</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="product-box p-6 bg-white dark:bg-dark-gray rounded-xl shadow-md text-center dark:text-white">
          <h3 class="text-xl font-semibold mb-4">Gym Equipment</h3>
          <p>High-quality equipment for all your fitness needs.</p>
        </div>
        <div class="product-box p-6 dark:text-white bg-white dark:bg-dark-gray rounded-xl shadow-md text-center" :class="{'bg-dark-gray': isDark, 'bg-white': !isDark}">
          <h3 class="text-xl font-semibold mb-4">Fitness Apparel</h3>
          <p>Comfortable and stylish workout clothing for every session.</p>
        </div>
        <div class="product-box p-6 bg-white dark:bg-dark-gray dark:text-white rounded-xl shadow-md text-center" >
          <h3 class="text-xl font-semibold mb-4">Supplements</h3>
          <p>Enhance your performance with our premium supplements.</p>
        </div>
      </div>
    </section>

    <!-- Trainers Section -->
    <section class="trainers p-8 bg-gray-100 dark:bg-dark-bg">
      <h2 class="text-3xl text-center mb-6 text-black dark:text-dark-text">Meet Our Trainers</h2>
      <div class="grid grid-cols-1 text-black dark:text-white md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="trainer-box p-6 bg-white dark:bg-dark-gray rounded-xl shadow-md text-center">
          <img src="" alt="Trainer 1" class="rounded-full mb-4 w-32 h-32 object-cover mx-auto"/>
          <h3 class="text-xl font-semibold mb-4">John Doe</h3>
          <p>Certified personal trainer with 10+ years of experience helping people achieve their fitness goals.</p>
        </div>
        <div class="trainer-box  p-6 bg-white dark:bg-dark-gray rounded-xl shadow-md text-center">
          <img src="" alt="Trainer 2" class="rounded-full mb-4 w-32 h-32 object-cover mx-auto"/>
          <h3 class="text-xl font-semibold mb-4">Jane Smith</h3>
          <p>Specialized in weight loss and strength training, helping you become the best version of yourself.</p>
        </div>
        <div class="trainer-box p-6 bg-white dark:bg-dark-gray rounded-xl shadow-md text-center">
          <img src="" alt="Trainer 3" class="rounded-full mb-4 w-32 h-32 object-cover mx-auto"/>
          <h3 class="text-xl font-semibold mb-4">Michael Lee</h3>
          <p>Expert in yoga and mobility, guiding clients toward a balanced, injury-free lifestyle.</p>
        </div>
      </div>
    </section>
    <!-- Footer Section -->
    <footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Slider from '~/components/Slider.vue';

const isDark = ref(true);
</script>