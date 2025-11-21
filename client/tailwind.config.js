/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "flex-dark": "#1a1a1a",
        "flex-gold": "#d4af37", // Hypothetical brand color
      },
    },
  },
  plugins: [],
};
