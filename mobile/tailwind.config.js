/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
}
