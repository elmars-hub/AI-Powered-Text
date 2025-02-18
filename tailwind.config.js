/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    fontFamily: {
      sans: '"Kumbh Sans", sans-serif',
    },
    extend: {
      colors: {
        light: {
          backgroundLight: "#fffbff",
          primaryLight: "#ffdbca",
          outline: "#85736b",
        },
        dark: {
          backgroundDark: "#201a18",
          primaryDark: "#783200",
          secondaryContainer: "#5c4032",
          outlineDark: "#52443d",
        },
      },
    },
  },
  plugins: [],
};
