import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f8ff",
          100: "#e6edff",
          200: "#c3d2ff",
          300: "#9bb5ff",
          400: "#6d8dff",
          500: "#4664ff",
          600: "#354de6",
          700: "#283ac0",
          800: "#1f2f97",
          900: "#1c2b75"
        }
      }
    }
  },
  plugins: []
};

export default config;
