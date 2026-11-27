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
          'navy-dark': '#062343',
          'navy-light': '#14538C',
          'navy-subtle': '#E8F1F8',
          blue: '#00A3E0',
          'blue-light': '#EBF7FD',
          'blue-dark': '#007AA8',
          emerald: '#059669',
          'emerald-light': '#ECFDF5',
          'emerald-border': '#A7F3D0',
          amber: '#D97706',
          'amber-light': '#FFFBEB',
          'amber-border': '#FDE68A',
          rose: '#E11D48',
          'rose-light': '#FFF1F2',
          slate: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          'border-light': '#F1F5F9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(11, 60, 104, 0.08), 0 8px 10px -6px rgba(11, 60, 104, 0.04)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
