// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-white": "#FFFFFF",
        "brand-cream": "#F8EEDF",
        "brand-gold": "#C9A76E",
        "brand-dark-brown": "#4E3B31",
        "brand-text": "#131010",
        "brand-green-accent": "#5A9690",
        "brand-maroon-accent": "#641B2E",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
