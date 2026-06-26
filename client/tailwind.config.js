export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16a34a",
          light: "#dcfce7",
          dark: "#15803d",
        },
        streak: {
          DEFAULT: "#ea580c",
          light: "#ffedd5",
          dark: "#c2410c",
        },
      },
    },
  },
  plugins: [],
};
