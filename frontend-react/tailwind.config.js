/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background colors for light and dark mode
        'bg-light': '#D4D8DD',   // Light background color
        'bg-dark': '#1A2D42',    // Dark background color

        'text-light': '#D4D8DD',
        'text-dark': '#1A2D42',
        // Primary colors
        'primary': '#1A2D42',     // Primary color (darkest)
        'primary-light': '#2E4156',  // Lighter primary color
        'primary-lighter': '#AAB7B7',  // Even lighter primary color
        'primary-lightest': '#C0C8CA',  // Lightest primary color

        // Secondary colors
        'secondary': '#AAB7B7',   // Secondary color (light gray)
        'secondary-light': '#C0C8CA',  // Lighter secondary color
        'secondary-lightest': '#D4D8DD',  // Lightest secondary color
      },

      animation: {
        pulse: 'pulse 0.8s infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '.8',
          },
        },
      },

      boxShadow: {
        'primary': '0 0 10px #1A2D42',
      },
    },
  },
  plugins: [],
}