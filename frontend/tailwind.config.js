/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'realm-green': '#4caf50',
        'realm-brown': '#795548',
        'realm-gold': '#ffb300',
        'realm-purple': '#8e24aa',
        'realm-stone': '#9e9e9e',
        'realm-parchment': '#f4e4bc'
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'], // For testing the feel, we can just use sans-serif if font not loaded
        'body': ['"Nunito"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
