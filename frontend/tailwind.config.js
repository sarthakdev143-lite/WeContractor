/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'responsive-sm': 'clamp(1rem, 1vw + 0.5rem, 1.3rem)',
        'responsive-md': 'clamp(1.5rem, 3vw + 1rem, 3rem)',
        'responsive-lg': 'clamp(2rem, 4vw + 1rem, 4rem)',
      },
    },
  },
  plugins: [],
}

