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
        // You can define your custom colors if needed
        'bg-light': '#f8f8f8',
        'bg-dark': '#1a1a1a',
        'text-light': '#333333',
        'text-dark': '#f0f0f0',
        'primary': '#1D4ED8',
        'primary-dark': '#1E40AF',
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
        'primary': '0 0 10px var(--primary-color)',
      },
    },
  },
  plugins: [],
}