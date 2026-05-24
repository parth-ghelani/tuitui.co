/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#F8F5F1',
        beige: '#E8DED1',
        charcoal: '#111111',
        cacao: '#6B4B44',
        gold: '#D4A574',
        umber: '#8B7355',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        luxe: '0.24em',
      },
      boxShadow: {
        soft: '0 24px 60px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
