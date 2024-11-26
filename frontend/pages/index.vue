<template>
  <div class="dark:bg-dark-bg bg-white">
    <!-- Hero Section -->
    <section
      class="hero scroll-animate flex flex-col items-center justify-center h-screen p-8 text-center dark:text-white text-black relative"
    >
      <h1
        class="text-5xl font-extrabold mb-6 text-white animate__animated animate__fadeIn animate__delay-1s"
      >
        Welcome to Our Gym
      </h1>
      <p
        class="text-xl mb-8 text-white animate__animated animate__fadeIn animate__delay-2s"
      >
        Achieve your fitness goals with us
      </p>
      <Slider
        class="animate__animated animate__fadeIn animate__delay-2s"
      />
      <div class="cta mt-8">
        <button
          class="btn-primary py-2 px-6 border hover:text-black border-blue dark:border-dark-blue text-black dark:text-white bg-blue dark:bg-dark-blue rounded-lg hover:bg-transparent dark:hover:bg-transparent hover:border-black dark:hover:border-white transition-all duration-300 transform hover:scale-110"
        >
          Get Started
        </button>
      </div>
    </section>

    <!-- Services Section -->
    <section
      class="features scroll-animate p-8 dark:bg-dark-bg bg-gray-100"
    >
      <h2
        class="text-3xl text-center mb-6 text-black dark:text-dark-text animate__animated animate__fadeIn animate__delay-1s"
      >
        Our Services
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          class="feature-box dark:text-white p-6 bg-white rounded-xl shadow-md text-center dark:bg-dark-gray hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <h3 class="text-xl font-semibold mb-4 text-blue">
            Personal Training
          </h3>
          <p>One-on-one coaching to help you reach your fitness goals faster.</p>
        </div>
        <div
          class="feature-box dark:text-white p-6 bg-white dark:bg-dark-gray rounded-xl shadow-md text-center hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <h3 class="text-xl font-semibold mb-4 text-blue">
            Group Classes
          </h3>
          <p>Join group fitness classes for a fun and motivating workout.</p>
        </div>
        <div
          class="feature-box dark:text-white p-6 bg-white dark:bg-dark-gray rounded-xl shadow-md text-center hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <h3 class="text-xl font-semibold mb-4 text-blue">
            Nutrition Plans
          </h3>
          <p>Customized nutrition plans to complement your workout routine.</p>
        </div>
      </div>
    </section>

    <!-- Other Sections -->
    <section
      class="products scroll-animate p-8 bg-gray-100 dark:bg-dark-bg"
    >
      <h2
        class="text-3xl text-center mb-6 text-black dark:text-dark-text animate__animated animate__fadeIn animate__delay-1s"
      >
        Our Products
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          class="product-box p-6 bg-white dark:bg-dark-gray rounded-xl shadow-md text-center dark:text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <h3 class="text-xl font-semibold mb-4 text-blue">
            Gym Equipment
          </h3>
          <p>High-quality equipment for all your fitness needs.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Slider from '~/components/Slider.vue';

onMounted(() => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__fadeIn');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    });

    // Observe elements with the `.scroll-animate` class
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });
  } else {
    console.warn('IntersectionObserver is not supported in this environment.');
  }
});
</script>
