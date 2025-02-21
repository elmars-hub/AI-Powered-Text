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
          primaryLight: "#fef1ec",
          outline: "#85736b",
        },
        dark: {
          backgroundDark: "#201a18",
          primaryDark: "#783200",
          secondaryContainer: "#5c4032",
          outlineDark: "#52443d",
        },
      },
      animation: {
        "rotate-light": "rotate-right 0.3s ease-in-out forwards",
        "rotate-dark": "rotate-left 0.3s ease-in-out forwards",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "theme-fade": "themeFade 0.3s ease-in-out",
      },
      keyframes: {
        "rotate-right": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(80deg)" },
        },
        "rotate-left": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-10deg)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        themeFade: {
          "0%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'theme': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
