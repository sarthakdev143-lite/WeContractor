/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontSize: {
        'responsive-sm': 'clamp(1rem, 1vw + 0.5rem, 1.3rem)',
        'responsive-md': 'clamp(1.5rem, 3vw + 1rem, 3rem)',
        'responsive-lg': 'clamp(2rem, 4vw + 1rem, 4rem)',
      },
    },
  },
  plugins: [],
};
