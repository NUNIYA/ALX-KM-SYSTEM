/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0066FF",
        primaryDark: "#0047B3",
        black: "#0A0A0A",
        darkGray: "#1F1F1F",
        lightGray: "#F5F5F5",
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        '4xl': '0 45px 80px -20px rgba(0, 0, 0, 0.4)',
        '5xl': '0 55px 100px -25px rgba(0, 0, 0, 0.5)',
        '6xl': '0 65px 120px -30px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
