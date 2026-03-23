/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0f172a',
        'navy-mid': '#1e293b',
        'navy-light': '#334155',
        blue: '#3b82f6',
        'blue-dark': '#2563eb',
        'blue-light': '#eff6ff',
        surface: '#ffffff',
        bg: '#f1f5f9',
        border: '#e2e8f0',
        'border-dark': '#cbd5e1',
        'text-1': '#0f172a',
        'text-2': '#475569',
        'text-3': '#94a3b8',
        success: '#16a34a',
        'success-bg': '#f0fdf4',
        warning: '#d97706',
        'warning-bg': '#fffbeb',
        danger: '#dc2626',
        'danger-bg': '#fef2f2',
        purple: '#7c3aed',
        'purple-bg': '#f5f3ff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'blue': '0 0 0 3px rgba(59,130,246,0.15)',
        'elevated': '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
