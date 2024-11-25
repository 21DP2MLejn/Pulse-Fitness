<template>
  <div class="bg-white dark:bg-dark-bg text-black dark:text-dark-text min-h-screen overflow-x-hidden">

    <!-- Hero Section with Background Image -->
    <section class="relative bg-cover bg-center bg-no-repeat h-screen" style="background-image: url('https://via.placeholder.com/1500x1000?text=Hero+Image');">
      <div class="absolute inset-0 bg-black opacity-50"></div> <!-- Dark overlay -->
      <div class="container mx-auto text-center relative z-10 py-32 px-6">
        <h1 class="text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight drop-shadow-md">Achieve Your Fitness Goals with Pulse Gym</h1>
        <p class="text-xl max-w-2xl mx-auto mb-6 text-white opacity-90">Join our community and start your journey to a healthier, stronger, and more confident you.</p>
        <button class="btn-primary text-white py-3 px-8 rounded-full text-lg hover:bg-white hover:text-blue dark:hover:bg-dark-light-gray dark:hover:text-dark-blue transition-all ease-in-out">
          Join Now
        </button>
      </div>
    </section>

    <!-- Smooth Scroll Navigation Section -->
    <section id="services" class="py-20 bg-light-gray dark:bg-dark-gray">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-semibold text-black dark:text-dark-text mb-8">Our Premium Services</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="service-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all">
            <img class="mx-auto mb-6" src="https://via.placeholder.com/100?text=PT" alt="Personal Training">
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Personal Training</h4>
            <p class="text-lg text-black dark:text-dark-text">Customized, one-on-one training with expert trainers.</p>
          </div>
          <div class="service-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all">
            <img class="mx-auto mb-6" src="https://via.placeholder.com/100?text=GC" alt="Group Classes">
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Group Classes</h4>
            <p class="text-lg text-black dark:text-dark-text">Energetic group workouts for all fitness levels.</p>
          </div>
          <div class="service-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all">
            <img class="mx-auto mb-6" src="https://via.placeholder.com/100?text=NC" alt="Nutrition Coaching">
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Nutrition Coaching</h4>
            <p class="text-lg text-black dark:text-dark-text">Expert nutrition plans to complement your training.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Class Schedule Section -->
    <section id="classes" class="py-16 bg-blue dark:bg-dark-blue text-white">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-semibold mb-6">Class Schedule</h3>
        <div class="tabs flex justify-center mb-8">
          <button class="tab-button active-tab py-2 px-6 rounded-full text-lg hover:bg-white hover:text-blue dark:hover:bg-dark-light-gray transition-all">Morning</button>
          <button class="tab-button py-2 px-6 rounded-full text-lg hover:bg-white hover:text-blue dark:hover:bg-dark-light-gray transition-all ml-4">Evening</button>
        </div>
        <div class="class-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div class="class-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md hover:scale-105 transform transition-all">
            <h4 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">Yoga</h4>
            <p class="text-lg text-black dark:text-dark-text">Monday - Friday | 6:00 AM</p>
          </div>
          <div class="class-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md hover:scale-105 transform transition-all">
            <h4 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">HIIT</h4>
            <p class="text-lg text-black dark:text-dark-text">Monday - Friday | 5:30 PM</p>
          </div>
          <div class="class-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md hover:scale-105 transform transition-all">
            <h4 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">Spin</h4>
            <p class="text-lg text-black dark:text-dark-text">Monday - Friday | 8:00 AM</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section with Slideshow -->
    <section id="testimonials" class="py-16 bg-light-gray dark:bg-dark-gray">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-semibold text-black dark:text-dark-text mb-10">What Our Members Say</h3>
        <div class="testimonial-slideshow relative overflow-hidden">
          <div class="flex">
            <div class="testimonial bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg max-w-sm mb-8 mx-auto transition-all transform">
              <p class="text-lg text-black dark:text-dark-text mb-4">"Pulse Gym has helped me transform my fitness routine. I’m stronger, healthier, and more motivated than ever!"</p>
              <h5 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">John Doe</h5>
              <p class="text-sm text-gray-500 dark:text-gray-300">Member since 2022</p>
            </div>
            <div class="testimonial bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg max-w-sm mb-8 mx-auto transition-all transform">
              <p class="text-lg text-black dark:text-dark-text mb-4">"The trainers are extremely knowledgeable, and the community is so supportive. I've never felt better!"</p>
              <h5 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">Jane Smith</h5>
              <p class="text-sm text-gray-500 dark:text-gray-300">Member since 2021</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Plans with Toggle -->
    <section id="pricing" class="py-16 bg-blue dark:bg-dark-blue text-white">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-semibold mb-6">Choose Your Plan</h3>
        <p class="text-lg max-w-xl mx-auto mb-8">Select a membership plan that fits your needs and start your fitness journey today!</p>
        <div class="pricing-toggle mb-8">
          <button class="pricing-toggle-btn py-2 px-6 rounded-full text-lg hover:bg-white hover:text-blue dark:hover:bg-dark-light-gray transition-all">Monthly</button>
          <button class="pricing-toggle-btn py-2 px-6 rounded-full text-lg hover:bg-white hover:text-blue dark:hover:bg-dark-light-gray transition-all ml-4">Yearly</button>
        </div>
        <div class="pricing-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <div class="pricing-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md">
            <h4 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">Basic Plan</h4>
            <p class="text-lg text-black dark:text-dark-text">$29/month</p>
            <button class="btn-primary py-2 px-6 rounded-lg text-button hover:bg-white hover:text-blue dark:hover:text-dark-blue dark:hover:bg-dark-light-gray">Choose Plan</button>
          </div>
          <div class="pricing-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md">
            <h4 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">Premium Plan</h4>
            <p class="text-lg text-black dark:text-dark-text">$59/month</p>
            <button class="btn-primary py-2 px-6 rounded-lg text-button hover:bg-white hover:text-blue dark:hover:text-dark-blue dark:hover:bg-dark-light-gray">Choose Plan</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section with Google Map -->
    <footer class="bg-dark-bg text-white py-8">
      <div class="container mx-auto text-center">
        <p class="mb-6">Pulse Gym | 123 Fitness St, Gymtown</p>
        <iframe src="https://maps.google.com/maps?q=your%20gym%20location&t=&z=13&ie=UTF8&iwloc=&output=embed" class="w-full h-64 rounded-lg shadow-md" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
</script>
