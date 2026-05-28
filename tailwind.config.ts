import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#151515",
        paper: "#fbf7ef",
        court: "#1f8f68",
        lime: "#d9ff73",
        base: "#2457ff"
      },
      boxShadow: {
        soft: "0 18px 70px rgba(21, 21, 21, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

