<template>
    <div class="loading-screen fixed inset-0 flex items-center justify-center bg-dark-blue z-50 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue via-light-gray to-dark-blue animate-background"></div>
      <div class="relative z-10 flex flex-col items-center justify-center">
        <div class="relative flex space-x-4 animate-pulse">
          <div class="w-16 h-16 rounded-full bg-blue animate-bounce"></div>
          <div class="w-16 h-16 rounded-full bg-light-gray animate-bounce"></div>
          <div class="w-16 h-16 rounded-full bg-dark-blue animate-bounce"></div>
        </div>
        
        <p class="text-white mt-8 text-3xl font-bold tracking-wider animate-textFade">
          Loading...
        </p>
        <div class="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-light-gray to-transparent opacity-30 animate-shimmer"></div>
      </div>
    </div>
  </template>
  
  <script>
  </script>
  
  <style scoped>

  