import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#8b0000',
          50: '#ffe5e7',
          100: '#fecdd3',
          200: '#fda4af',
          300: '#fb7185',
          400: '#f43f5e',
          500: '#e11d48',
          600: '#b10000',
          700: '#8b0000',
          800: '#660000',
          900: '#3f0000',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
