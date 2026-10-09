/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dpw: {
          navy: '#002D56',
          navyDark: '#001A33',
          navyLight: '#0A3B66',
          blue: '#004B87',
          blueLight: '#0084FF',
          blueMuted: '#EBF3FA',
          accent: '#FF6B00',
          bg: '#F4F6F8',
          card: '#FFFFFF',
          border: '#E2E8F0',
          borderDark: '#CBD5E1',
          textMain: '#0F172A',
          textSecondary: '#475569',
          textMuted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

