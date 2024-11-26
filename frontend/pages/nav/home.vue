<template>
  <div class="bg-white dark:bg-dark-bg text-black dark:text-dark-text min-h-screen overflow-x-hidden">
    <!-- Hero Section -->
    <section 
      class="relative bg-cover bg-center bg-no-repeat h-screen" 
      style="background-image: url('https://via.placeholder.com/1500x1000?text=Hero+Image');" 
      data-aos="fade-in" 
      data-aos-duration="1500">
      <div class="absolute inset-0 bg-black opacity-50"></div> <!-- Dark overlay -->
      <div class="container mx-auto text-center relative z-10 py-32 px-6">
        <h1 class="text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight drop-shadow-md" data-aos="fade-up" data-aos-duration="1000">
          Achieve Your Fitness Goals with Pulse Gym
        </h1>
        <p class="text-xl max-w-2xl mx-auto mb-6 text-white opacity-90" data-aos="fade-up" data-aos-duration="1200">
          Join our community and start your journey to a healthier, stronger, and more confident you. We offer personalized training, nutrition coaching, and group classes designed to meet your fitness goals.
        </p>
        <div class="flex justify-center space-x-4" data-aos="zoom-in" data-aos-duration="1400">
          <button class="btn-primary text-white py-3 px-8 rounded-full text-lg hover:bg-white hover:text-blue dark:hover:bg-dark-light-gray dark:hover:text-dark-blue transition-all ease-in-out">
            Join Now
          </button>
          <button class="btn-secondary text-white py-3 px-8 rounded-full text-lg hover:bg-transparent hover:text-blue dark:hover:bg-dark-light-gray dark:hover:text-dark-blue transition-all ease-in-out">
            Learn More
          </button>
          <button class="btn-outline text-white py-3 px-8 rounded-full text-lg hover:bg-transparent hover:text-blue dark:hover:bg-dark-light-gray dark:hover:text-dark-blue transition-all ease-in-out">
            Contact Us
          </button>
        </div>
      </div>
    </section>

    <!-- Premium Services Section -->
    <section id="services" class="py-20 bg-light-gray dark:bg-dark-gray">
      <div class="container mx-auto text-center" data-aos="fade-up" data-aos-duration="1000">
        <h3 class="text-3xl font-semibold text-black dark:text-dark-text mb-8">Our Premium Services</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            class="service-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all"
            data-aos="fade-right">
            <img class="mx-auto mb-6" src="https://via.placeholder.com/100?text=PT" alt="Personal Training" />
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Personal Training</h4>
            <p class="text-lg text-black dark:text-dark-text">Customized, one-on-one training with expert trainers.</p>
          </div>
          <div
            class="service-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all"
            data-aos="zoom-in">
            <img class="mx-auto mb-6" src="https://via.placeholder.com/100?text=GC" alt="Group Classes" />
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Group Classes</h4>
            <p class="text-lg text-black dark:text-dark-text">Energetic group workouts for all fitness levels.</p>
          </div>
          <div
            class="service-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all"
            data-aos="fade-left">
            <img class="mx-auto mb-6" src="https://via.placeholder.com/100?text=NC" alt="Nutrition Coaching" />
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Nutrition Coaching</h4>
            <p class="text-lg text-black dark:text-dark-text">Expert nutrition plans to complement your training.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Events Section -->
    <section id="events" class="py-20 bg-light-gray dark:bg-dark-gray" data-aos="fade-up" data-aos-duration="1000">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-semibold text-black dark:text-dark-text mb-8">Upcoming Events</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="event-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all" data-aos="zoom-in">
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Fitness Challenge</h4>
            <p class="text-lg text-black dark:text-dark-text">A month-long fitness challenge to push your limits!</p>
            <p class="text-md text-gray-500 dark:text-gray-300">Starts on: December 1st</p>
          </div>
          <div class="event-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all" data-aos="zoom-in">
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Nutrition Workshop</h4>
            <p class="text-lg text-black dark:text-dark-text">Learn the secrets to better nutrition for optimal health.</p>
            <p class="text-md text-gray-500 dark:text-gray-300">Workshop date: December 10th</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Class Schedule Section -->
    <section id="classes" class="py-16 bg-blue dark:bg-dark-blue text-white" data-aos="fade-in" data-aos-duration="1000">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-semibold mb-6">Class Schedule</h3>
        <div class="tabs flex justify-center mb-8">
          <button class="tab-button active-tab py-2 px-6 rounded-full text-lg hover:bg-white hover:text-blue dark:hover:bg-dark-light-gray transition-all">Morning</button>
          <button class="tab-button py-2 px-6 rounded-full text-lg hover:bg-white hover:text-blue dark:hover:bg-dark-light-gray transition-all ml-4">Evening</button>
          <button class="tab-button py-2 px-6 rounded-full text-lg hover:bg-white hover:text-blue dark:hover:bg-dark-light-gray transition-all ml-4">Weekend</button>
        </div>
        <div class="class-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10" data-aos="fade-up">
          <div class="class-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md hover:scale-105 transform transition-all">
            <h4 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">Yoga</h4>
            <p class="text-lg text-black dark:text-dark-text">Monday - Friday | 6:00 AM</p>
          </div>
          <div class="class-card bg-light-gray dark:bg-dark-gray p-8 rounded-lg shadow-md hover:scale-105 transform transition-all">
            <h4 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">HIIT</h4>
            <p class="text-lg text-black dark:text-dark-text">Monday - Friday | 5:30 PM</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-16 bg-light-gray dark:bg-dark-gray" data-aos="fade-up" data-aos-duration="1000">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-semibold text-black dark:text-dark-text mb-10">What Our Members Say</h3>
        <div class="testimonial-slideshow relative overflow-hidden">
          <div class="flex">
            <div class="testimonial bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg max-w-sm mb-8 mx-auto transition-all transform" data-aos="fade-in">
              <p class="text-lg text-black dark:text-dark-text mb-4">"Pulse Gym has helped me transform my fitness routine. I’m stronger, healthier, and more motivated than ever!"</p>
              <h5 class="text-xl font-semibold text-blue dark:text-dark-blue mb-4">John Doe</h5>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!--Prices Section-->
    <section id="prices" class="py-16 bg-blue dark:bg-dark-blue text-white" data-aos="fade-in" data-aos-duration="1000">
      <div class="container mx-auto text-center">
        <h3 class="text-3xl font-semibold text-black dark:text-dark-text mb-10">Prices</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="price-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all" data-aos="fade-right">
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Monthly Membership</h4>
            <p class="text-lg text-black dark:text-dark-text">Monthly membership fee for access to all facilities.</p>
            <p class="text-lg text-black dark:text-dark-text">Includes access to all classes and equipment.</p>
          </div>
          <div class="price-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all" data-aos="fade-up">
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Yearly Membership</h4>
            <p class="text-lg text-black dark:text-dark-text">Yearly membership fee for access to all facilities.</p>
            <p class="text-lg text-black dark:text-dark-text">Includes access to all classes and equipment.</p>
          </div>
          <div class="price-card bg-white dark:bg-dark-bg p-8 rounded-lg shadow-lg hover:scale-105 transform transition-all" data-aos="fade-left">
            <h4 class="text-2xl font-semibold text-blue dark:text-dark-blue mb-4">Family Membership</h4>
            <p class="text-lg text-black dark:text-dark-text">Family membership fee for access to all facilities.</p>
            <p class="text-lg text-black dark:text-dark-text">Includes access to all classes and equipment.</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Footer Section with Google Map -->
    <footer class="bg-dark-bg text-white py-8">
      <div class="container mx-auto text-center">
        <iframe src="https://maps.google.com/maps?q=your%20gym%20location&t=&z=13&ie=UTF8&iwloc=&output=embed" class="w-full h-64 rounded-lg shadow-md" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";

onMounted(() => {
  AOS.init({
    duration: 1200,
    offset: 200,
    once: true,
  });
});

</script>
