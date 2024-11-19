<template>
  <div class="bg-white dark:bg-dark-bg text-black dark:text-dark-text min-h-screen transition-colors duration-300">
    <!-- Hero Section -->
    <section class="bg-blue dark:bg-dark-blue text-white dark:text-dark-light-gray py-20">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-h1 font-bold mb-4">Achieve Your Fitness Goals</h2>
        <p class="text-p max-w-2xl mx-auto">
          Join Pulse Gym and start your journey to a healthier, stronger, and more confident you.
        </p>
        <button class="mt-8 btn-primary text-white py-3 px-6 rounded-lg text-button hover:bg-white hover:text-blue dark:hover:text-dark-blue dark:hover:bg-dark-light-gray">
          Get Started
        </button>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-20 px-6">
      <div class="container mx-auto text-center">
        <h3 class="text-h2 font-semibold text-black dark:text-dark-text mb-6">Our Services</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="service-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md">
            <h4 class="text-h3 font-semibold text-blue dark:text-dark-blue mb-4">Personal Training</h4>
            <p class="text-p text-black dark:text-dark-text">One-on-one sessions with expert trainers tailored to your goals.</p>
          </div>
          <div class="service-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md">
            <h4 class="text-h3 font-semibold text-blue dark:text-dark-blue mb-4">Group Classes</h4>
            <p class="text-p text-black dark:text-dark-text">Fun and engaging classes for all fitness levels.</p>
          </div>
          <div class="service-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md">
            <h4 class="text-h3 font-semibold text-blue dark:text-dark-blue mb-4">Nutrition Coaching</h4>
            <p class="text-p text-black dark:text-dark-text">Personalized meal plans and coaching for optimal results.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call-to-Action Section -->
    <section class="bg-blue dark:bg-dark-blue text-white dark:text-dark-light-gray py-16">
      <div class="container mx-auto px-6 text-center">
        <h3 class="text-h2 font-semibold mb-6">Ready to Join?</h3>
        <p class="text-p max-w-xl mx-auto mb-8">
          Become a member today and take the first step towards a healthier lifestyle.
        </p>
        <button class="btn-primary text-white py-3 px-8 rounded-lg text-button hover:bg-white hover:text-blue dark:hover:text-dark-blue dark:hover:bg-dark-light-gray">
          Sign Up Now
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

