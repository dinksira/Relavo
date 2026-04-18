/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0f172a',
        'brand-navy-mid': '#1e293b',
        'brand-navy-light': '#334155',
        'brand-blue': '#3b82f6',
        'brand-blue-dark': '#2563eb',
        'brand-blue-light': '#eff6ff',
        'brand-surface': '#ffffff',
        'brand-bg': '#f1f5f9',
        'brand-border': '#e2e8f0',
        'brand-border-dark': '#cbd5e1',
        'brand-text-1': '#0f172a',
        'brand-text-2': '#475569',
        'brand-text-3': '#94a3b8',
        'brand-success': '#16a34a',
        'brand-success-bg': '#f0fdf4',
        'brand-warning': '#d97706',
        'brand-warning-bg': '#fffbeb',
        'brand-danger': '#dc2626',
        'brand-danger-bg': '#fef2f2',
        'brand-purple': '#7c3aed',
        'brand-purple-bg': '#f5f3ff',
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
