/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        relavo: {
          navy: '#1b2a3b',
          navyDark: '#0f172a',
          blue: '#3b82f6',
          blueDark: '#1d4ed8',
          blueLight: '#eff6ff',
          surface: '#f8fafc',
          border: '#e2e8f0',
          text: {
            primary: '#0f172a',
            secondary: '#64748b',
            muted: '#94a3b8',
          },
          success: '#16a34a',
          warning: '#d97706',
          danger: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '10px',
        'button': '8px',
        'input': '8px',
      },
      boxShadow: {
        'relavo': '0 1px 3px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
