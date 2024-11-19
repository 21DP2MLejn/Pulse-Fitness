<template>
  <div class="loading-screen fixed inset-0 flex items-center justify-center bg-gray-900 z-50 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-900 animate-background"></div>
    <div class="relative z-10 flex flex-col items-center justify-center space-y-6">
      <div class="relative flex items-center justify-center space-x-6 animate-lift">
        <div class="w-12 h-12 rounded-full bg-light-blue dark:bg-dark-blue shadow-lg"></div>
        <div class="w-12 h-12 rounded-full bg-blue dark:bg-black shadow-lg"></div>
        <div class="w-12 h-12 rounded-full bg-dark-blue dark:bg-dark-bg shadow-lg"></div>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 rounded-full bg-light-blue dark:bg-dark-blue"></div>
        <div class="w-48 h-3 bg-blue dark:bg-black rounded animate-barPulse"></div>
        <div class="w-6 h-6 rounded-full bg-dark-blue dark:bg-dark-bg"></div>
      </div>
      <p class="text-white text-2xl font-extrabold tracking-widest animate-pulse">
        PULSE FITNESS
      </p>
    </div>
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
  </div>
</template>

  

  