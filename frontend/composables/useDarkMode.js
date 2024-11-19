export const useDarkMode = () => {
    const isDark = useState('isDark', () => false);
  
    const toggleDarkMode = () => {
      isDark.value = !isDark.value;
      document.documentElement.classList.toggle('dark', isDark.value);
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    };
  
    const initializeDarkMode = () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDark.value = true;
        document.documentElement.classList.add('dark');
      }
    };
  
    if (process.client) {
      initializeDarkMode();
    }
  
    return { isDark, toggleDarkMode };
  };
  