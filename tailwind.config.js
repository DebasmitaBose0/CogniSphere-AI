/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Editorial Forest Green Palette
        forest: {
          50: '#f2f7f4',
          100: '#e1ece5',
          200: '#c3d9cc',
          300: '#9ebfae',
          400: '#74a18c',
          500: '#52856f',
          600: '#3e6a57',
          700: '#315445',
          800: '#274438',
          900: '#1a3328', // Deep forest green
          950: '#091611', // Dark forest green visual field
        },
        ink: {
          950: '#0c100e',
          900: '#141a17',
          800: '#232b27',
          700: '#38433e',
          600: '#526059',
          500: '#718079',
          400: '#94a29c',
          300: '#c2ccc7',
        },
        parchment: {
          50: '#faf9f5', // Warm white / off-white
          100: '#f4f2ea',
          200: '#e9e6da',
          300: '#dad5c4',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
