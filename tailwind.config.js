/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Vert principal UIECC
        primaire: {
          50:  '#f0faf2',
          100: '#dcf5e3',
          200: '#b8eac5',
          300: '#86d49e',
          400: '#4eb870',
          500: '#2a9a4a',
          600: '#227838',
          700: '#1a5e2c',
          800: '#174d25',
          900: '#143f1f',
          950: '#0a2211',
        },
        // Jaune accent UIECC
        accent: {
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        // Fond clair
        fond: '#f8faf8',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.85)', opacity: '0.7' },
          '70%':  { transform: 'scale(1)',    opacity: '0.3' },
          '100%': { transform: 'scale(0.85)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};