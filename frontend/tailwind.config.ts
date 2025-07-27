//frontend/tailwind.config.ts

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ativa tema via classe .dark
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // paleta modo claro
        input: "#ffffff", // fundo claro
        primary: "#E63946",
        secondary: "#F1FAEE",
        accent: "#A8DADC",
        // paleta modo escuro
        darkbg: "#1B1B1E",
        darkfg: "#E5E5EA",
        darkaccent: "#457B9D",

        inputDark: "#2c2c2c", // fundo escuro
        textDark: "#E5E5EA", // texto no escuro
      },
    },
  },
  plugins: [],
};
