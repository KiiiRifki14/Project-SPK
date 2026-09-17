/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bps: {
          navy: '#0B3C68',
          'navy-dark': '#062544',
          'navy-light': '#14538C',
          blue: '#00A3E0',
          'blue-light': '#E0F4FC',
          'blue-dark': '#0081B3',
          emerald: '#10B981',
          'emerald-light': '#ECFDF5',
          amber: '#F59E0B',
          'amber-light': '#FFFBEB',
          rose: '#EF4444',
          'rose-light': '#FEF2F2',
          slate: '#F8FAFC',
          dark: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
