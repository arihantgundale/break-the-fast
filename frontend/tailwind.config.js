/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#C0392B',       // Deep Crimson Red
        'primary-dark': '#A93226',
        secondary: '#E67E22',     // Warm Saffron
        'secondary-dark': '#D35400',
        cream: '#FFFDF7',         // Off-White background
        charcoal: '#1A1A1A',      // Text Primary
        slate: '#555555',         // Text Secondary
        'pure-veg': '#27AE60',    // Forest Green accent
        'pure-veg-light': '#2ECC71',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
