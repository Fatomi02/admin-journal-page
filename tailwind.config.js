/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': "#d80c6c",
        'dark-grey': "#333333",
        'light-grey': '#fafafa',
        'error': '#e02424',
      }
    },
  },
  plugins: [],
}

