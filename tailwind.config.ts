import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        accent: '#f97316',
        surface: '#0f172a',
        'surface-light': '#f8fafc'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        floating: '0 20px 60px rgba(99, 102, 241, 0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
