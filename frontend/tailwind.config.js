/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dce4fd',
          300: '#c2cdfa',
          400: '#a1adf5',
          500: '#7d87ee',
          600: '#6366f1',
          700: '#524ee1',
          800: '#443fba',
          900: '#3a3894',
        }
      }
    }
  },
  plugins: [],
};
