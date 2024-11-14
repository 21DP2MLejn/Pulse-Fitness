/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode with 'class' strategy
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'white': '#FFFFFF',
        'light-gray': '#A8A8A8',
        'black': '#2E2E2E',
        'blue': '#1A73E8',
        'dark-blue': '#1D2B53',


        // Dark mode colors
        'dark-bg': '#1B1B1D',         
        'dark-text': '#E0E0E0',       
        'dark-gray': '#3A3A3A',       
        'dark-blue': '#0A1F44',       
        'dark-light-gray': '#6B6B6B', 

        // Other
        'light-blue': '#5591e0',
        'success': '#34D399',
        'warning': '#FBBF24',
        'error': '#EF4444',
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '3rem' }],  
        'h2': ['2rem', { lineHeight: '2.5rem' }],  
        'h3': ['1.75rem', { lineHeight: '2.25rem' }],
        'p': ['1rem', { lineHeight: '1.6rem' }],      
        'a': ['1rem', { lineHeight: '1.6rem' }],      
        'li': ['1rem', { lineHeight: '1.6rem' }],     
        'button': ['1.125rem', { lineHeight: '2rem' }],
      },
      fontWeight: {
        'h1': 'bold',            
        'h2': 'semibold',        
        'h3': 'normal',          
        'p': 'normal',           
        'a': 'medium',           
        'li': 'normal',          
        'button': 'bold',        
      }
    },
  },
  plugins: [],
}


