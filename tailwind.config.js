/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        sumut: {
          blue: '#00AEEF', // Primary Brand Color (decorative use only)
          darkBlue: '#007BB5', // Use for text on light bg or bg with white text
          deepBlue: '#005A87', // WCAG AA compliant - 4.5:1 with white
          orange: '#F7941D', // Secondary Accent Color  
          darkOrange: '#D97706', // WCAG AA compliant for large text
          deepOrange: '#B45309', // WCAG AA compliant - 4.5:1 with white
          orangeLight: '#FFF0D9',
          grey: '#F3F4F6',
          text: '#334155', // High contrast text
          textLight: '#64748B' // Secondary text, passes on white bg
        }
      }
    },
  },
  plugins: [],
}
