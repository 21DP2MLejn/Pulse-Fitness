<template>
    <div class="relative w-full overflow-hidden rounded-xl">
      <div
        class="flex transition-transform duration-500"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="w-full flex-shrink-0"
        >
          <img
            :src="image"
            alt="Gym Image"
            class="w-full h-80 object-cover rounded-xl"
          />
        </div>
      </div>
      <!-- Navigation Arrows -->
      <div class="absolute top-1/2 left-0 transform -translate-y-1/2 text-white cursor-pointer" @click="prev">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </div>
      <div class="absolute top-1/2 right-0 transform -translate-y-1/2 text-white cursor-pointer" @click="next">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const images = [
    '/images/gym1.jpg',
    '/images/gym2.jpg',
    '/images/gym3.jpg',
    '/images/gym4.jpg',
  ];
  
  const currentIndex = ref(0);
  
  const next = () => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
  };
  
  const prev = () => {
    currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
  };
  </script>
  