/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        corporate: {
          purple: "#8A1C8C",
          orange: "#F2620F",
          background: "#F2F2F2"
        }
      }
    }
  },
  plugins: []
};
