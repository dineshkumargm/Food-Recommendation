/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 15s linear infinite',
      },
      dropShadow: {
        neon: '0 0 10px #e0f, 0 0 20px #a0f',
      },
      textShadow: {
        neon: '0 0 6px #0ff, 0 0 12px #0ff',
      },
    },
  },
  plugins: [],
}
