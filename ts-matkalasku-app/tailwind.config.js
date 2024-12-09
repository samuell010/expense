/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", //Enable dark mode support with the 'class' strategy
  content: ["./index.html", "./src/**/*{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark mode
        "blue-dark-300": "#D0E1F9", // Light element color
        "blue-dark-800": "#4D648D", // Dark element color
        "blue-dark-900": "#283655", // Window background color
        "blue-dark-950": "#1E1F26", // Main background color
        // Light mode
        "cyan-light-50": "#F5FDFC", // CURRENTLY NOT IN USE
        "cyan-light-300": "#A1D6E2", // Light element color
        "cyan-light-600": "#1995AD", // Dark element color
        "gray-light-100": "#F1F1F2", // Window background color
        "gray-light-400": "#BCBABE", // Main background color
        "gray-light-900": "#444444", // CURRENTLY NOT IN USE
      },
      fontFamily: {
        robotoTitle: ["Roboto", "sans-serif"],
        openSansBody: ["Open Sans", "sans-serif"],
      },
      backgroundImage: {
        "login-bg": "url('src/assets/bgimage1.jpg')",
      },
    },
  },
  plugins: [],
};
